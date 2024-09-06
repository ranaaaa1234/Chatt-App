const express = require('express');
const mongoose = require('mongoose');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// CSRF Protection Middleware
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// MongoDB connection
const dbURI = 'mongodb+srv://testingjensen:testingjensen@cluster0.d5vq4.mongodb.net/node.auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
  })
  .catch((err) => console.log(err));

// CSRF Token Route
app.patch('/csrf', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const User = mongoose.model('User', userSchema);

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, 'your-secret-key', { expiresIn: '1h' });

    res.json({ token, id: user._id, username: user.username, email: user.email });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send('No token provided.');

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) return res.status(500).send('Failed to authenticate token.');
    req.userId = decoded.userId;
    next();
  });
};

// Message Schema
const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  avatar: { type: String, required: true },
  username: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conversationID: { type: String, required: true }
});

const Conversation = mongoose.model('Conversation', conversationSchema);

// Send Message Route
app.post('/messages', verifyToken, async (req, res) => {
  const { text, avatar, username, conversationId, userId } = req.body;

  const newMessage = new Message({ text, avatar, username, userId, conversationId });

  try {
    const savedMessage = await newMessage.save();
    res.status(201).json({ id: savedMessage._id, ...savedMessage._doc });
  } catch (error) {
    console.error(error);
    res.status(500).send('There was a problem creating the message.');
  }
});

// Get All Messages Route
app.get('/messages', verifyToken, async (req, res) => {
  const { conversationId } = req.query;
  try {
    const messages = await Message.find({ conversationId });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Delete Message Route
app.delete('/messages/:id', verifyToken, async (req, res) => {
  const messageId = req.params.id;
  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).send('Message not found.');

    if (message.userId.toString() !== req.userId) return res.status(403).send('Unauthorized.');

    await Message.findByIdAndDelete(messageId);
    res.status(200).send('Message deleted successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('There was a problem deleting the message.');
  }
});


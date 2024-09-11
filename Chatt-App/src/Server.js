const express = require('express');
const mongoose = require('mongoose');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

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
  avatar: { type: String, }  // <-- Added avatar field to store avatar URLs
});

const User = mongoose.model('User', userSchema);

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { username, password, email, avatar } = req.body; // <-- Capture avatar on registration

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      avatar: avatar || 'https://i.pravatar.cc' // <-- Default avatar if not provided
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

    // Include avatar in JWT token
    const token = jwt.sign(
      { id: user._id, 
        username: user.username,  
        email: user.email,
        avatar: user.avatar 
      },
      'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      id: user._id, 
      username: user.username, 
      email: user.email,
      avatar: user.avatar 
    });
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
    req.username = decoded.username;
    req.avatar = decoded.avatar;
    next();
  });
};

// Message Schema
const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  avatar: { type: String, required: true },
  username: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conversationID: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

//Conversation Schema
const conversationSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
conversationID: { type: String, required: true }
});

const Conversation = mongoose.model('Conversation', conversationSchema);

// Create Conversation Route
app.post('/conversations', verifyToken, async (req, res) => {
  const { userIds } = req.body;

  if (!userIds || userIds.length === 0) {
    return res.status(400).json({ message: 'User IDs are required' });
  }

 try {
    const conversationID = new mongoose.Types.ObjectId().toString(); // Generate a new unique ID
    const newConversation = new Conversation({ userIds, conversationID });
    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Failed to create conversation' });
  }
});


// Send Message Route
app.post('/messages', verifyToken, async (req, res) => {
  const { text, conversationID } = req.body;

  if (!conversationID) {
    return res.status(400).json({ message: 'Conversation ID is required' });
  }
  
  const newMessage = new Message({
    text,
    avatar: req.avatar,        // Automatically use avatar from the token
    username: req.username,    // Automatically use username from the token
    userId: req.userId,        // Automatically use userId from the token
    conversationID
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(201).json({ 
      id: savedMessage._id, 
      text: savedMessage.text,
      avatar: savedMessage.avatar,
      username: savedMessage.username,
      userId: savedMessage.userId,
      conversationID: savedMessage.conversationID,
      createdAt: savedMessage.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('There was a problem creating the message.');
  }
});

// Get All Messages Route
app.get('/messages', verifyToken, async (req, res) => {
  const { conversationID } = req.query;

  if (!conversationID) {
    return res.status(400).json({ message: 'Conversation ID is required' });
  }
  try {
    const messages = await Message.find({ conversationID });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Delete Message Route


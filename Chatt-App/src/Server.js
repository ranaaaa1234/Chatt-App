
// Importera nödvändiga paket
const express = require('express');
const mongoose = require('mongoose');

// Skapa en Express-applikation
const app = express();

// Middleware för att hantera JSON-data
app.use(express.json());

// Anslut till MongoDB-databasen med Mongoose
const dbURI = 'mongodb+srv://testingjensen:testingjensen@cluster0.d5vq4.mongodb.net/node.auth'>
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
  })
  .catch((err) => console.log(err));

// Definiera en enkel route
app.get('/', (req, res) => {
  res.send('Hello, this is your Node.js server!');
});

// Lägg till fler routes här för t.ex. registrering och inloggning

// Skapa en User-model för MongoDB
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  });
  
  const User = mongoose.model('User', userSchema);
  
  // Route för registrering av användare
  app.post('/register', async (req, res) => {
    try {
      const { username, password, email } = req.body;
  
      // Kontrollera om användarnamn eller email redan finns
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
  
      // Hasha lösenordet innan det sparas i databasen
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Skapa och spara en ny användare
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
  
  // Route för inloggning av användare
  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Hitta användaren baserat på användarnamn
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Jämför lösenordet med det hashade lösenordet i databasen
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generera en JWT-token för den inloggade användaren
      const token = jwt.sign({ userId: user._id, username: user.username }, 'your-secret-key', { expiresIn: '1h' });
  
      res.json({ token, id: user._id, username: user.username, avatar: user.avatar });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });
  
  // En enkel testroute
  app.get('/', (req, res) => {
    res.send('Hello, this is your Node.js server!');
  });
  
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { json } = require('body-parser');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

dotenv.config();

// Routes
const authRoutes = require('./routes/auth');
const habitsRoutes = require('./routes/habits');
const usersRoutes = require('./routes/users');

// Initialize Firebase Admin SDK if service account exists
if (process.env.FIREBASE_PROJECT_ID) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(json());

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', authenticateUser, habitsRoutes);
app.use('/api/users', authenticateUser, usersRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
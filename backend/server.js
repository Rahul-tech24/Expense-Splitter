import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/user.route.js';
import groupRoutes from './routes/groupRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to parse JSON bodies

connectDB(); 

// Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: "Server is running smoothly" });
});

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);



app.listen(PORT, () => {

  console.log(`Server is breathing on port ${PORT}`);
});


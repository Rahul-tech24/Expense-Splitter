import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/user.route.js';
import groupRoutes from './routes/groupRoutes.js';
import expenseRoutes from './routes/expense.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL
]

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error("Not allowed by CORS"))
    },
    credentials: true
  })
)

app.use(express.json()); // Allows us to parse JSON bodies

connectDB(); 

// Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: "Server is running smoothly" });
});

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);


app.listen(PORT, () => {

  console.log(`Server is breathing on port ${PORT}`);
});


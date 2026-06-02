import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from './routes/userRoutes.js';
import connectDB from './database/db.js';

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error('Server startup failed:', error.message);
  process.exit(1);
});

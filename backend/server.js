import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js'
import connectDB from './database/db.js';
import cors from 'cors';
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"
const port = process.env.PORT || 5000;
const app = express();
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

//middleware
app.use(express.json());
app.use(cors({
  origin:['http://localhost:5173',
  "https://fresh-roots-grocery.vercel.app",],
  credentials:true
}))
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/products',productRoutes);
app.use('/api/carts',cartRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);


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

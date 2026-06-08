// JWT token verify করার জন্য jsonwebtoken package import করা হচ্ছে
import jwt from 'jsonwebtoken';

// MongoDB থেকে user খুঁজে বের করার জন্য User model import করা হচ্ছে
import User from '../models/userModels.js';

// Authentication middleware
// Protected route access করার আগে এই middleware run হবে
export const isAuthenticated = async (req, res, next) => {
  try {
    // Request header থেকে authorization field নেওয়া হচ্ছে
    // Example:
    // Authorization: Bearer eyJhbGciOiJIUzI1Ni...
    const authHeader = req.headers.authorization;

    // Check করা হচ্ছে:
    // 1. Authorization header আছে কি না
    // 2. Bearer format follow করছে কি না
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({
        success: false,
        message: 'Authorization token is missing or invalid',
      });
    }

    // "Bearer token" থেকে শুধু token অংশ বের করা হচ্ছে
    // Example:
    // "Bearer abc123"
    // split করলে ["Bearer", "abc123"]
    // [1] index = "abc123"
    const token = authHeader.split(' ')[1];

    // Decoded token data রাখার জন্য variable
    let decoded;

    try {
      // Token verify করা হচ্ছে
      // SECRET_KEY match করলে decoded payload return করবে
      // Example:
      // {
      //   id: "6851abc123",
      //   iat: 123456789,
      //   exp: 123456999
      // }
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      // Token expire হয়ে গেলে
      if (error.name === 'TokenExpiredError') {
        return res.status(400).json({
          success: false,
          message: 'The token has expired',
        });
      }

      // Invalid token হলে
      return res.status(400).json({
        success: false,
        message: 'Access token is missing or invalid',
      });
    }

    // Token থেকে পাওয়া user id দিয়ে database এ user খোঁজা হচ্ছে
    const user = await User.findById(decoded.id);

    // User database এ না থাকলে
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    // User ID request object এর সাথে attach করা হচ্ছে
    // পরের controller এ req.id ব্যবহার করা যাবে
    req.user = user
    req.id = user._id;

    // সব ঠিক থাকলে next middleware/controller এ যাবে
    next();
  } catch (error) {
    // Unexpected server error handle করা হচ্ছে
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const isAdmin = (req,res,next) =>{
    if(req.user && req.user.role === 'admin'){
        next()
    }else{
        return res.status(403).json({
            message:"Access denied"

        })
    }
}
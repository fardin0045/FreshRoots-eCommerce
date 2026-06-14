import User from '../models/userModels.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyEmail } from '../emailVerify/verifyEMail.js';
import { Session } from '../models/sessionModel.js';
import { sendOTPMail } from '../emailVerify/sendOTPMail.js';
import cloudinary from '../utils/cloudinary.js';
//Register
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All filed are required',
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User Already Exist',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    //token
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: '10m',
    });
    verifyEmail(token, email); //send email
    newUser.token = token;
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: 'User Registered successfully',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//verify email
export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({
        success: false,
        message: 'Authorization token is missing or invalid',
      });
    }
    const token = authHeader.split(' ')[1]; //[Bearer, fghffsdfjkhfgjksdhf]
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(400).json({
          success: false,
          message: 'The registration token has expired',
        });
      }
      
      return res.status(400).json({
        success: false,
        message: ' token verification has failed',
      });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    user.token = null;
    user.isVerified = true;
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'Email Verified successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

///re verify
export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'user not found',
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: '10m',
    });
    verifyEmail(token, email); //send email
    user.token = token;
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'Verification send again successfully',
      token: user.token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: 'user does not exist',
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
    if (existingUser.isVerified == false) {
      return res.status(400).json({
        success: false,
        message: 'Please verify you  account and then login',
      });
    }
    //generate token
    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: '10d' },
    );
    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: '20d' },
    );

    existingUser.isLoggedIn = true;
    await existingUser.save();

    //check for existing session and dlt it
    const existingSession = await Session.findOne({ userId: existingUser._id });
    if (existingSession) {
      await Session.deleteOne({ userId: existingUser._id });
    }
    //create a new session
    await Session.create({ userId: existingUser._id });
    return res.status(200).json({
      success: true,
      message: `Welcome back ${existingUser.firstName}`,
      user: existingUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Logout
export const logout = async (req, res) => {
  try {
    const userId = req.id;
    await Session.deleteMany({ userId: userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    return res.status(200).json({
      success: true,
      message: 'Logout Successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User Not found',
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();
    await sendOTPMail(otp, email);

    return res.status(200).json({
      success: true,
      message: 'OTP send to email successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//Forgot password verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP is require',
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP is not generated or already verified',
      });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired please request a new one',
      });
    }
    if (otp != user.otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP is invalid',
      });
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'OTP verify successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }
    if (newPassword != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password does not match',
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'Password change successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//Get All user
export const allUser = async (_, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
      '-password -otp -otpExpiry -token',
    );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//upload image
export const updateUser = async (req,res) => {
  try {
    const userIdToUpdate = req.params.id; //the id of the user we wants to update
    const loggedInUser = req.user; //from authenticated middleware
    const {firstName, lastName, address, city, zipCode, phoneNumber, role} =
      req.body;

    if (
      loggedInUser._id.toString() !== userIdToUpdate &&
      loggedInUser.role !== 'admin'
    ) {
      return res.status(400).json({
        success: false,
        message: 'You are not allowed to update the profile',
      });
    }
    let user = await User.findById(userIdToUpdate)
    if(!user){
      return res.status(400).json({
        success:false,
        message:"User not found"
      })
    }
    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    //if new file uploaded
    if(req.file){
      if(profilePicPublicId){
        await cloudinary.uploader.destroy(profilePicPublicId)
      }
      const uploadResult = await new Promise((resolve, reject)=>{
        const stream = cloudinary.uploader.upload_stream(
          {folder:"profiles"},
          (error,result)=>{
            if(error) reject(error)
              else resolve(result)
          }
        )
        stream.end(req.file.buffer)
      })
      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id
    }
    //update fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    user.phoneNumber = phoneNumber || user.phoneNumber
    user.role=role;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updateUser = await user.save()
    return res.status(200).json({
      success:true,
      message:"Profile Updated successfully",
      user:updateUser
    })

  } catch(error){
    return res.status(500).json({
      success: false,
      message: error.message
  })}
}

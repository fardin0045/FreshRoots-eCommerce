import User from '../models/userModels.js';

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
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });
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

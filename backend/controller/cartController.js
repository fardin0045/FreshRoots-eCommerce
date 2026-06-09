import mongoose from 'mongoose';
import { Cart } from '../models/cartModel.js';
import { Product }  from '../models/productModel.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.id;

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.json({
        success: true,
        cart: [],
      });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error('Get cart error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'Product not found',
      });
    }
    if (typeof product.productPrice !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Product price is not available',
      });
    }
    //find the user cart if exist
    let cart = await Cart.findOne({ userId });

    // if cart does not exist create a new one
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1, price: product.productPrice }],
        totalPrice: product.productPrice,
      });
    } else {
      //if product is already in the cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );
      if (itemIndex > -1) {
        //if product exists -> just increase quantity
        cart.items[itemIndex].quantity += 1;
      } else {
        //if new product  -> push to cart
        cart.items.push({
          productId,
          quantity: 1,
          price: product.productPrice,
        });
      }
      //recalculate total price
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
    }
    //save updated cart
    await cart.save();

    //populate product details before sending response
    const populatedCart = await Cart.findById(cart._id).populate(
      'items.productId',
    );

    res.status(200).json({
      success: true,
      message: 'Product added to cart Successfully',
      cart: populatedCart,
    });
  } catch (error) {
    console.error('Add cart error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, type } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart)
      return res.status(400).json({
        success: false,
        message: 'Cart not found',
      });

    const item = cart.items.find(
      (item) => item.productId.toString() === productId,
    );
    if (!item)
      return res.status(400).json({
        success: false,
        message: 'Items not found',
      });
    if (type === 'increase') item.quantity += 1;
    if (type === 'decrease' && item.quantity > 1) item.quantity -= 1;
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    await cart.save();
    cart = await cart.populate('items.productId');
    res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const {productId} = req.body;
    let cart = await Cart.findOne({userId});
    if(!cart) return res.status(400).json({
      success: false,
      message: "Cart not found",
    });
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    cart.totalPrice = cart.items.reduce((acc, item)=> acc+item.price*item.quantity, 0)
    
    cart = await cart.populate('items.productId')

    await cart.save();
    res.status(200).json({
        success:true,
        cart
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

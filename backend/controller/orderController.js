import { Cart } from '../models/cartModel.js';
import Order from '../models/orderModel.js';
import User from '../models/userModels.js';
import {Product} from '../models/productModel.js';

export const checkout = async (req, res) => {
  try {
    const userId = req.id || req.userId || req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Calculate charges
    const shipping = cart.totalPrice > 498 ? 0 : 70;
    const tax = Number((cart.totalPrice * 0.06).toFixed(2));

    // Generate transaction id
    const transactionId = `TXN_${Date.now()}`;

    const { address, paymentMethod = 'ONLINE' } = req.body;

    if (!address || !address.address1 || !address.city || !address.fullName || !address.phone || !address.email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid delivery address and contact details.',
      });
    }

    // Create order
    const order = await Order.create({
      user: userId,

      products: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),

      amount: cart.totalPrice,

      tax,

      shipping,

      currency: 'BDT',

      status: 'Pending',

      transactionId,

      deliveryAddress: {
        fullName: address.fullName,
        email: address.email,
        phone: address.phone,
        address1: address.address1,
        address2: address.address2,
        city: address.city,
      },

      paymentMethod,
    });

    if (paymentMethod === 'COD') {
      await Cart.deleteOne({ userId });
      return res.status(201).json({
        success: true,
        message: 'Cash on Delivery order created successfully',
        order,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Checkout Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error?.message || String(error),
    });
  }
};

export const getMyOrder = async (req, res) => {
  try {
    const userId = req.id;
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'products.productId',
        select: 'productName productPrice productImg',
      })
      .populate('user', 'firstName lastName email');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'products.productId',
        select: 'productName productPrice productImg',
      }) //fetch product details
      .populate('user', 'firstName lastName email');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('products.productId', 'productName productPrice');
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err?.message || String(err),
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: 'Status is required' });
    }

    const order = await Order.findById(id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });

    order.status = status;
    await order.save();

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    return res
      .status(500)
      .json({ success: false, message: error?.message || String(error) });
  }
};

export const getSalesData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({ status: 'Paid' });

    // total sales
    const totalSaleAgg = await Order.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalSales = totalSaleAgg[0]?.total || 0;
    //sales grouped by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const salesByDate = await Order.aggregate([
      { $match: { status: 'Paid', createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          amount: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const formattedSales = salesByDate.map((item) => ({
      date: item._id,
      amount: item.amount,
    }));
    res.json({
      success: true,
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales,
      sales: formattedSales,
    });
  } catch (err) {
    console.log('error Fetching sales data', err);
    return res
      .status(500)
      .json({ success: false, message: err?.message || String(err) });
  }
};

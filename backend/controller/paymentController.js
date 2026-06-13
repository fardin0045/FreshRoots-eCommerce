import axios from "axios"
import Order from "../models/orderModel.js";
import { Cart } from "../models/cartModel.js";
import User from "../models/userModels.js";

const getRequestParam = (req, key) => {
  if (req.body && req.body[key] !== undefined) return req.body[key];
  if (req.query && req.query[key] !== undefined) return req.query[key];
  return undefined;
};

const getFrontendURL = () => {
  const url = process.env.PAYMENT_RETURN_URL || 'http://localhost:5173';
  return url.replace(/\/$/, '');
};

const getBackendURL = () => {
  const url = process.env.BACKEND_URL || 'http://localhost:8000';
  return url.replace(/\/$/, '');
};

// Initiate SSL Commerz Payment
export const initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.id;

    const order = await Order.findById(orderId).populate('user');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentMethod === 'COD') {
      return res.status(400).json({
        success: false,
        message: 'Cash on Delivery orders cannot be paid through the online gateway.',
      });
    }

    // Get user details
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const totalAmount = order.amount + order.tax + order.shipping;

    // Use delivery address from the order or fallback to user profile
    const deliveryAddress = order.deliveryAddress || {};
    const userEmail = deliveryAddress.email || user.email || "customer@example.com";
    const userName =
      deliveryAddress.fullName ||
      (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email?.split('@')[0] || "Customer");
    const userPhone = deliveryAddress.phone || user.phoneNumber || "01700000000";
    const userAddress = deliveryAddress.address1 || user.address || "Dhaka, Bangladesh";
    const userCity = deliveryAddress.city || user.city || "Dhaka";

    const backendURL = getBackendURL();
    const paymentData = {
      store_id: process.env.STORE_ID,
      store_passwd: process.env.STORE_PASSWORD,
      total_amount: totalAmount,
      currency: "BDT",
      tran_id: order.transactionId,
      success_url: `${backendURL}/api/payment/success`,
      fail_url: `${backendURL}/api/payment/fail`,
      cancel_url: `${backendURL}/api/payment/cancel`,
      cus_name: userName,
      cus_email: userEmail,
      cus_add1: userAddress,
      cus_city: userCity,
      cus_country: "Bangladesh",
      cus_phone: userPhone,
      shipping_method: "NO",
      product_name: "FreshRoots Order",
      product_category: "Ecommerce",
      product_profile: "general",
    };

    console.log("Initiating SSL Payment with data:", {
      store_id: paymentData.store_id,
      total_amount: paymentData.total_amount,
      tran_id: paymentData.tran_id,
      cus_name: paymentData.cus_name,
      cus_email: paymentData.cus_email,
      cus_phone: paymentData.cus_phone,
    });

    // SSL API requires form-encoded data, not JSON
    const params = new URLSearchParams();
    Object.keys(paymentData).forEach(key => {
      params.append(key, paymentData[key]);
    });

    // Save SSL Session Key to Order
    const response = await axios.post(
      "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log("SSL Response:", response.data);

    if (response.data.status === "FAILED") {
      console.error("SSL Payment Failed Response:", response.data);
      return res.status(400).json({
        success: false,
        message: response.data.failedreason || "Failed to initialize payment",
        details: response.data,
      });
    }

    if (!response.data.GatewayPageURL) {
      console.error("No Gateway URL in SSL Response:", response.data);
      return res.status(400).json({
        success: false,
        message: "Failed to get payment gateway URL",
        details: response.data,
      });
    }

    // Update order with SSL session key
    order.sslSessionKey = response.data.sessionkey;
    await order.save();

    return res.status(200).json({
      success: true,
      paymentUrl: response.data.GatewayPageURL,
    });
  } catch (error) {
    console.error("Payment Initiation Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Payment initialization failed",
      error: error.response?.data || error.message,
    });
  }
};

// Handle Payment Success
export const paymentSuccess = async (req, res) => {
  try {
    const tran_id = getRequestParam(req, 'tran_id');
    const val_id = getRequestParam(req, 'val_id');
    const amount = getRequestParam(req, 'amount');
    const card_type = getRequestParam(req, 'card_type');
    const frontendURL = getFrontendURL();

    console.log("Payment Success Response:", {
      body: req.body,
      query: req.query,
    });

    // Find order by transaction ID
    const order = await Order.findOne({ transactionId: tran_id });

    if (!order) {
      return res.redirect(`${frontendURL}/payment/fail?message=Order not found`);
    }

    // Verify payment with SSLCommerz
    const verifyData = {
      store_id: process.env.STORE_ID,
      store_passwd: process.env.STORE_PASSWORD,
      val_id: val_id,
    };

    const verifyResponse = await axios.get(
      "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php",
      { params: verifyData }
    );

    if (verifyResponse.data.status === "VALID") {
      // Payment is verified - Update order status
      order.status = "Paid";
      order.paidAt = new Date();
      order.paymentMethod = card_type || "ONLINE";
      await order.save();

      // Clear user's cart
      await Cart.deleteOne({ userId: order.user });

      console.log("Payment verified and order updated:", order._id);

      return res.redirect(`${frontendURL}/payment/success?orderId=${order._id}&amount=${amount}&tran_id=${tran_id}`);
    } else {
      return res.redirect(`${frontendURL}/payment/fail?message=Payment verification failed`);
    }
  } catch (error) {
    const frontendURL = getFrontendURL();
    console.log("Payment Success Error:", error);
    return res.redirect(`${frontendURL}/payment/fail?message=${encodeURIComponent(error.message)}`);
  }
};

// Handle Payment Fail
export const paymentFail = async (req, res) => {
  try {
    const tran_id = getRequestParam(req, 'tran_id');
    const frontendURL = getFrontendURL();

    console.log("Payment Failed for transaction:", tran_id, {
      body: req.body,
      query: req.query,
    });

    // Update order status to failed
    const order = await Order.findOne({ transactionId: tran_id });

    if (order) {
      order.status = "Failed";
      await order.save();
    }

    return res.redirect(`${frontendURL}/payment/fail?message=Payment Failed&tran_id=${tran_id}`);
  } catch (error) {
    const frontendURL = getFrontendURL();
    console.log("Payment Fail Error:", error);
    return res.redirect(`${frontendURL}/payment/fail?message=${encodeURIComponent(error.message)}`);
  }
};

// Handle Payment Cancel
export const paymentCancel = async (req, res) => {
  try {
    const tran_id = getRequestParam(req, 'tran_id');
    const frontendURL = getFrontendURL();

    console.log("Payment Cancelled for transaction:", tran_id, {
      body: req.body,
      query: req.query,
    });

    // Update order status to cancelled
    const order = await Order.findOne({ transactionId: tran_id });

    if (order) {
      order.status = "Cancelled";
      await order.save();
    }

    return res.redirect(`${frontendURL}/payment/cancel?message=Payment Cancelled&tran_id=${tran_id}`);
  } catch (error) {
    const frontendURL = getFrontendURL();
    console.log("Payment Cancel Error:", error);
    return res.redirect(`${frontendURL}/payment/cancel?message=${encodeURIComponent(error.message)}`);
  }
};

// Verify Payment Status (for polling)
export const verifyPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      status: order.status,
      order,
    });
  } catch (error) {
    console.log("Verify Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
};
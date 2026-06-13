import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    amount: {
      type: Number,
      required: true,
    },

    tax: {
      type: Number,
      default: 0,
    },

    shipping: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: 'BDT',
    },

    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Cancelled'],
      default: 'Pending',
    },

    deliveryAddress: {
      fullName: { type: String },
      email: { type: String },
      phone: { type: String },
      address1: { type: String },
      address2: { type: String },
      city: { type: String },
    },

    // SSLCommerz Fields
    transactionId: {
      type: String,
      unique: true,
    },

    sslSessionKey: {
      type: String,
    },

    paymentMethod: {
      type: String,
      enum: ['ONLINE', 'COD'],
      default: 'ONLINE',
    },

    paidAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Order', orderSchema);

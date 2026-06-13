# SSL Ecommerce Payment Integration Guide

This project includes full SSL Ecommerce (SSLCommerz) payment gateway integration for processing online payments in Bangladesh.

## Overview

The payment integration follows a complete real-world workflow:
1. User selects delivery address during checkout
2. Order is created with `Pending` status
3. Payment is initiated with SSL Ecommerce
4. User is redirected to SSL Ecommerce payment gateway
5. User completes payment (card, mobile banking, etc.)
6. SSL Ecommerce redirects back to your app with payment status
7. Payment is verified and order status is updated
8. Cart is cleared on successful payment

## Environment Setup

### Required SSL Ecommerce Credentials

You need to obtain these from [SSLCommerz](https://www.sslcommerz.com/):

```env
STORE_ID=your_ssl_store_id          # Example: fresh6a2a3e2d79cf4
STORE_PASSWORD=your_ssl_password    # Example: fresh6a2a3e2d79cf4@ssl
PAYMENT_RETURN_URL=http://localhost:5173  # Your frontend URL
```

Currently, the `.env` file contains:
```env
STORE_ID=fresh6a2a3e2d79cf4
STORE_PASSWORD=fresh6a2a3e2d79cf4@ssl
```

## Backend Implementation

### 1. Payment Controller (`backend/controller/paymentController.js`)

**Exports:**

#### `initiatePayment(orderId)`
- Creates payment request with SSL Ecommerce API
- Uses user's address and contact information
- Returns payment gateway URL
- Saves SSL session key to order

#### `paymentSuccess(tran_id, val_id)`
- Handles successful payment callback
- Verifies payment with SSL Ecommerce API
- Updates order status to `Paid`
- Clears user's shopping cart
- Redirects to payment success page

#### `paymentFail(tran_id)`
- Handles failed payment callback
- Updates order status to `Failed`
- Redirects to payment fail page

#### `paymentCancel(tran_id)`
- Handles cancelled payment callback
- Updates order status to `Cancelled`
- Redirects to payment cancel page

#### `verifyPaymentStatus(orderId)`
- API endpoint to check order payment status
- Used for polling payment status from frontend

### 2. Payment Routes (`backend/routes/paymentRoutes.js`)

```javascript
POST   /api/payment/pay/:orderId         // Initiate payment
GET    /api/payment/success              // Payment success callback
GET    /api/payment/fail                 // Payment fail callback
GET    /api/payment/cancel               // Payment cancel callback
GET    /api/payment/verify/:orderId      // Verify payment status
```

### 3. Order Model Updates

The Order schema includes SSL Ecommerce specific fields:
- `transactionId`: Unique transaction ID
- `sslSessionKey`: SSL session key for verification
- `paymentMethod`: Payment method used (card type, etc.)
- `paidAt`: Payment timestamp
- `status`: Order status (Pending, Paid, Failed, Cancelled)

## Frontend Implementation

### 1. Payment Return Page (`frontend/src/pages/PaymentReturn.jsx`)

Displays payment status with appropriate messaging:
- **Success**: Shows order ID, transaction ID, and amount paid
- **Failed**: Shows error message with retry option
- **Cancelled**: Shows cancellation message with cart recovery option
- **Loading**: Shows processing indicator while verifying payment

Routes:
```
/payment/success   - Successful payment page
/payment/fail      - Failed payment page
/payment/cancel    - Cancelled payment page
```

### 2. Address Form Updates (`frontend/src/pages/AddressForm.jsx`)

Enhanced checkout flow:
- Form validation before saving address
- Error handling with user-friendly messages
- Loading state while processing payment
- Real-time error display
- Address selection with visual feedback
- Comprehensive order summary

### 3. App Routes (`frontend/src/App.jsx`)

Added payment return routes:
```javascript
/payment/success
/payment/fail
/payment/cancel
```

## Payment Flow Diagram

```
┌─────────────────────┐
│  Address Selection  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Create Order       │ (Status: Pending)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Initiate Payment    │
│ (Call SSL API)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Redirect to         │
│ SSL Payment Gateway │
└──────────┬──────────┘
           │
           ▼
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌────────┐  ┌────────┐
│Success │  │ Failed/│
│        │  │Cancelled
└────┬───┘  └───┬────┘
     │          │
     ▼          ▼
┌──────────────────────┐
│ Update Order Status  │
│ Clear Cart           │
│ Redirect to Result   │
└──────────────────────┘
```

## Testing Payment Integration

### Using SSL Sandbox

The integration uses SSL's sandbox environment for testing:
- URL: `https://sandbox.sslcommerz.com/gwprocess/v4/api.php`
- No real payments are processed
- Test cards available on SSL documentation

### Test Flow

1. Start your server:
```bash
cd backend && npm start
cd frontend && npm run dev
```

2. Navigate to checkout:
   - Add products to cart
   - Go to `/address`
   - Add/select delivery address
   - Click "Proceed To Checkout"

3. On SSL Payment Gateway:
   - Test with sandbox credentials
   - Use test card/payment method
   - Complete the transaction

4. Verify Results:
   - Check payment status page
   - View order in dashboard
   - Verify cart is cleared

## Key Features

✅ **Secure Payment Processing**
- SSL session key validation
- Transaction ID verification
- Redirect authentication

✅ **Error Handling**
- Network error management
- Payment verification failures
- User-friendly error messages

✅ **Order Management**
- Status tracking (Pending → Paid)
- Cart clearing on success
- Transaction logging

✅ **User Experience**
- Loading indicators
- Real-time status updates
- Clear success/failure messages
- One-click retry on failure

✅ **Data Validation**
- Address verification
- Cart validation
- Order amount verification

## Troubleshooting

### Payment Gateway Not Responding
- Check internet connection
- Verify SSL credentials in `.env`
- Ensure firewall allows outbound requests

### Payment Success but Order Not Updated
- Check backend logs for verification errors
- Verify transaction ID format
- Check database connection

### Redirect Issues
- Ensure `PAYMENT_RETURN_URL` is correctly set
- Frontend routes `/payment/*` must exist
- Check browser console for redirect errors

### Cart Not Clearing
- Verify `Cart.deleteOne()` in paymentSuccess
- Check user ID is correctly passed
- Ensure cart entry exists for user

## Production Deployment

### Before Going Live

1. **Get SSL Ecommerce Production Credentials**
   - Contact SSL Ecommerce support
   - Complete KYC verification
   - Receive production Store ID and Password

2. **Update Environment Variables**
   ```env
   STORE_ID=your_production_store_id
   STORE_PASSWORD=your_production_password
   PAYMENT_RETURN_URL=https://your-domain.com
   ```

3. **Change Payment Gateway URL**
   - Update `initiatePayment()` to use production URL:
   ```javascript
   const url = process.env.NODE_ENV === 'production'
     ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
     : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
   ```

4. **Set HTTPS**
   - Ensure all URLs use HTTPS
   - Update `PAYMENT_RETURN_URL` to HTTPS

5. **Test Payment**
   - Process a test transaction
   - Verify order creation and status update
   - Confirm email notifications work

## File Structure

```
backend/
├── controller/
│   └── paymentController.js       # Payment logic
├── routes/
│   └── paymentRoutes.js           # Payment endpoints
├── models/
│   └── orderModel.js              # Order schema (with SSL fields)
└── .env                           # SSL credentials

frontend/
├── src/
│   ├── pages/
│   │   ├── AddressForm.jsx        # Checkout page
│   │   └── PaymentReturn.jsx      # Payment result page
│   └── App.jsx                    # Routes setup
```

## API Reference

### Initiate Payment
```bash
POST /api/payment/pay/:orderId
Headers: Authorization: Bearer {token}
Response: { success: true, paymentUrl: "SSL_GATEWAY_URL" }
```

### Verify Payment Status
```bash
GET /api/payment/verify/:orderId
Headers: Authorization: Bearer {token}
Response: { success: true, status: "Paid", order: {...} }
```

## Support

For SSL Ecommerce support:
- Website: https://www.sslcommerz.com/
- Documentation: https://developer.sslcommerz.com/
- Support Email: support@sslcommerz.com

## Security Notes

- Never expose Store ID or Password in frontend code ✅
- Always verify transactions on backend ✅
- Use HTTPS in production ✅
- Validate all payment callback data ✅
- Implement rate limiting on payment endpoints
- Log all payment transactions for audit trail

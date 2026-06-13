import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { 
  initiatePayment, 
  paymentSuccess, 
  paymentFail, 
  paymentCancel, 
  verifyPaymentStatus 
} from "../controller/paymentController.js";

const router = express.Router();

router.post("/pay/:orderId", isAuthenticated, initiatePayment);
router.route("/success").get(paymentSuccess).post(paymentSuccess);
router.route("/fail").get(paymentFail).post(paymentFail);
router.route("/cancel").get(paymentCancel).post(paymentCancel);
router.get("/verify/:orderId", isAuthenticated, verifyPaymentStatus);

export default router;
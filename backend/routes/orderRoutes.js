import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { checkout, getAllOrdersAdmin, getMyOrder, getSalesData, getUserOrders, updateOrderStatus } from "../controller/orderController.js";

const router = express.Router();

router.post("/checkout", isAuthenticated, checkout);
router.get("/my-order", isAuthenticated, getMyOrder);
router.get("/all-order", isAuthenticated, isAdmin, getAllOrdersAdmin);
router.get("/user-order/:userId", isAuthenticated,isAdmin, getUserOrders);
router.put("/:id", isAuthenticated, isAdmin, updateOrderStatus);
router.get("/sales", isAuthenticated, isAdmin, getSalesData);



export default router;
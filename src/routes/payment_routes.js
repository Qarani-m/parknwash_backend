import express from 'express';
import { processPayment } from '../controller/payments_controller.js';

const router = express.Router();
router.post('/payments/stk-push', processPayment);


export default router; // Export the router

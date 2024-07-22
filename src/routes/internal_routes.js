import { callbackHandler,  stkPushHandler} from "../controller/internal_controller.js"
import express from 'express';
const router = express.Router();
 

router.post('/callback', callbackHandler);
router.post('/stkpush', stkPushHandler);
  

export default router; 


// const { amount, phoneNumber, paymentId } = req.body;
// if (!amount || !phoneNumber || !paymentId) {
//   return res.status(400).json({ error: 'Amount, phone number, and payment ID are required' });
// }
// console.log(`Received payment request of ${amount} for phone number ${phoneNumber} with document id ${paymentId}`);
// const delayInMilliseconds = 5000;
// setTimeout(async () => {
//   try {

//     const docId =paymentId
//     const docRef = doc(db, "payments", docId);        
//     await setDoc(docRef, {
//       amount: "2000",
//       createdAt : Timestamp.now(),
//       expired: false,
//       referenceId:"refId",
//       bookingId: paymentId,
//       uid:"ceDdguXSAxd71F2sTp5CXHTUzY02"
//     });

//     console.log(`Processing payment of ${amount} for phone number ${phoneNumber}`);
//     res.json({
//       success: true,
//       message: 'Payment processed successfully',
//       amount,
//       phoneNumber
//     });
//   } catch (error) {
//     console.error('Error adding document:', error);
//     res.status(500).json({ error: 'Could not process payment, please try again' });
//   }
// }, delayInMilliseconds);
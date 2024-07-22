import { callbackHandler,  stkPushHandler} from "../controller/internal_controller.js"
import express from 'express';
const router = express.Router();
 

router.post('/callback', callbackHandler);
router.post('/stkpush', stkPushHandler);
  

export default router; 


 
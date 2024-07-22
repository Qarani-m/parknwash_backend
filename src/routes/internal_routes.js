import { callbackHandler,  stkPushHandler} from "../controller/internal_controller.js"
import express from 'express';
const router = express.Router();
 

router.post('/callback', callbackHandler);
router.post('/stkpush', stkPushHandler);
  

router.get("/",(req, res)=>{
    resizeBy.send("====>")
})

export default router; 


 
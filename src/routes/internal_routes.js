import {getAccessToken, callbackHandler, accessTokenHandler,stkPushHandler} from "../controller/internal_controller.js"
import express from 'express';
const router = express.Router();
 

router.get('/access_token', accessTokenHandler);
router.post('/callback', callbackHandler);
router.get('/stkpush', stkPushHandler);
  

export default router; // Export the router

import {getAccessToken, callbackHandler, accessTokenHandler} from "../controller/internal_controller.js"
import express from 'express';
const router = express.Router();
 

router.get('/access_token', accessTokenHandler);
router.post('/callback', callbackHandler);

  

export default router; // Export the router

import axios from "axios";
import fs from "fs";
import moment from 'moment';
import { db } from "./firebase-config.js"
 import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";

 async function callbackHandler(req, res) {
    const ResultCode = req.body.Body.stkCallback.ResultCode;
 

    if (ResultCode == 2001) {
        message = 'The initiator information is invalid.';
    } else if (ResultCode == 1032) {
        message = 'Request cancelled by user';
    } else if (ResultCode == 0) {
        const callbackMetadata = req.body.Body.stkCallback.CallbackMetadata.Item;
        const amount = callbackMetadata.find(item => item.Name === "Amount").Value;
        const receipt = callbackMetadata.find(item => item.Name === "MpesaReceiptNumber").Value;
        const phoneNumber = callbackMetadata.find(item => item.Name === "PhoneNumber").Value;

         
        // const data = {
        //     amount: amount,
        //     createdAt: Timestamp.now(),
        //     expired: false,
        //     referenceId: receipt,
        //     phone: phoneNumber,
        //     bookingId: "paymentIdOmni",
        //     uid: "userIdOmni"
        // };

        console.log( JSON.stringify(req.body))
 
    }
    res.status(200).end();
}




async function saveToFireStoreA(paymentId, userId,CheckoutRequestID ) {
    const data = {
        bookingId:paymentId,
        uid: userId
    };
    try {
        const docRef = doc(db, "payments", CheckoutRequestID);
        await setDoc(docRef, data);
        console.log("Document written with ID: ", docRef.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error('Error adding document:', error);
        // Make sure this error handling is appropriate for your application structure
        if (res) {
            res.status(500).json({ error: 'Could not process payment, please try again' });
        }
    }

}
async function stkPushHandler(req, res) {



    const { amount, phoneNumber, bookingData, userId } = req.body;
    if (!amount || !phoneNumber || !bookingData || !userId) {
        return res.status(400).json({ error: 'Amount, phone number, and payment ID are required' });
    }

 
    getAccessToken()
        .then((accessToken) => {
            const url = process.env.SANDBOX_REQUEST_URL;
            const auth = 'Bearer ' + accessToken;
            const timestamp = moment().format('YYYYMMDDHHmmss');
            const password = Buffer.from(
                '174379' + process.env.PASS_KEY + timestamp
            ).toString('base64');

            axios.post(
                url,
                {
                    BusinessShortCode: '174379',
                    Password: password,
                    Timestamp: timestamp,
                    TransactionType: 'CustomerPayBillOnline',
                    Amount: amount.split(".")[0],
                    PartyA: phoneNumber,
                    PartyB: '174379',
                    PhoneNumber: phoneNumber,
                    CallBackURL: process.env.CALLBACK_URL,
                    AccountReference: "DOTTY_LITTLEONE",
                    TransactionDesc: ` ${userId}:${bookingData}`,
                },
                {
                    headers: {
                        Authorization: auth,
                    },
                }
            )
            .then(async (response) => {

                console.log(response.data)
                if(response.data.ResponseCode=="0"){
                    await saveToFireStoreA(bookingData,userId, response.data.CheckoutRequestID)
                }
                res.status(200).json({
                    message: "We're processing your payment. Please enter your M-Pesa PIN to complete the transaction.", 
                    "paymendId":response.data.CheckoutRequestID
                     
                });
            })
                .catch((error) => {
                    console.log(error);
                    res.status(500).send('❌ Request failed❌');
                });
        })
        .catch(console.log);

};
async function getAccessToken() {
    const consumer_key = process.env.CONSUMER_KEY;
    const consumer_secret = process.env.CONSUMER_SECRET;
    const url = process.env.SANDBOX_URL;
    const auth =
        "Basic " +
        new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: auth,
            },
        });
        const dataresponse = response.data;
        const accessToken = dataresponse.access_token;
        return accessToken;
    } catch (error) {
        throw error;
    }
}
function accessTokenHandler(req, res) {
    getAccessToken()
        .then((accessToken) => {
            res.send("😀 Your access token is " + accessToken);
        })
        .catch(console.log);
};


export { getAccessToken, callbackHandler, accessTokenHandler, stkPushHandler }


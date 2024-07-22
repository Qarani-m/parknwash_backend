import axios from "axios";
import fs from "fs";
import moment from 'moment';
import { db } from "./firebase-config.js"
import path from 'path';


import { doc, setDoc, Timestamp } from "firebase/firestore";
import { Console } from "console";

let paymentIdOmni;
let userIdOmni;



async function callbackHandler(req, res) {
    const ResultCode = req.body.Body.stkCallback.ResultCode;
    if (ResultCode == 2001) {
        //The initiator information is invalid.
    } else if (ResultCode == 1032) {
        //Request cancelled by user
    } else if (ResultCode == 0) {
        const callbackMetadata = req.body.Body.stkCallback.CallbackMetadata.Item;
        const amount = callbackMetadata.find(item => item.Name === "Amount").Value;
        const receipt = callbackMetadata.find(item => item.Name === "MpesaReceiptNumber").Value;
        const phoneNumber = callbackMetadata.find(item => item.Name === "PhoneNumber").Value;


        var json = JSON.stringify(req.body);



        const data ={
            amount: amount,
            createdAt: Timestamp.now(),
            expired: false,
            referenceId: receipt,
            bookingId: "paymentIdOmni",
            uid: "userIdOmni"
        }

        try {

            const docRef = doc(db, "payments", "paymentId");
            await setDoc(docRef, data);
            res.json({
                success: true,
                message: 'Payment processed successfully',
                amount,
                phoneNumber
            });
        } catch (error) {
            console.error('Error adding document:', error);
            res.status(500).json({ error: 'Could not process payment, please try again' });
        }


    } else {

    }
};




function stkPushHandler(req, res) {
    const { amount, phoneNumber, paymentId, userId } = req.body;

    if (!amount || !phoneNumber || !paymentId || !userId) {
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
                    Amount: amount,
                    PartyA: phoneNumber,
                    PartyB: '174379',
                    PhoneNumber: phoneNumber,
                    CallBackURL: process.env.CALLBACK_URL,
                    AccountReference: "DOTTY_LITTLEONE",
                    TransactionDesc: ` ${userId}:${paymentId}`,
                },
                {
                    headers: {
                        Authorization: auth,
                    },
                }
            )
                .then((response) => {
                    res.send('😀 Request is successful done ✔✔. Please enter mpesa pin to complete the transaction');
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


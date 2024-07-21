import axios  from "axios";
import fs from "fs";
import moment from 'moment';


async function getAccessToken() {
const consumer_key =process.env.CONSUMER_KEY;
const consumer_secret =process.env.CONSUMER_SECRET;
const url =process.env.SANDBOX_URL;
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




function callbackHandler  (req, res){
  console.log("STK PUSH CALLBACK");
  
  const CheckoutRequestID = req.body.Body.stkCallback.CheckoutRequestID;
  const ResultCode = req.body.Body.stkCallback.ResultCode;
  const callbackMetadata = req.body.Body.stkCallback.CallbackMetadata.Item;

  const amount = callbackMetadata.find(item => item.Name === "Amount").Value;
  const receipt = callbackMetadata.find(item => item.Name === "MpesaReceiptNumber").Value;
  const transactionDate = callbackMetadata.find(item => item.Name === "TransactionDate").Value;
  const phoneNumber = callbackMetadata.find(item => item.Name === "PhoneNumber").Value;

  var json = JSON.stringify(req.body);

  console.log(json)
 

//   console.log(`CheckoutRequestID: ${CheckoutRequestID}`);
//   console.log(`ResultCode: ${ResultCode}`);
//   console.log(`Amount: ${amount}`);
//   console.log(`Receipt: ${receipt}`);
//   console.log(`TransactionDate: ${transactionDate}`);
//   console.log(`PhoneNumber: ${phoneNumber}`);
};

 function accessTokenHandler  (req, res){
    getAccessToken()
      .then((accessToken) => {
        res.send("😀 Your access token is " + accessToken);
      })
      .catch(console.log);
  };


function  stkPushHandler  (req, res){
    getAccessToken()
      .then((accessToken) => {
        const url = process.env.SANDBOX_REQUEST_URL;
        const auth = 'Bearer ' + accessToken;
        const timestamp = moment().format('YYYYMMDDHHmmss');
        const password = Buffer.from(
          '174379' +process.env.PASS_KEY +timestamp
        ).toString('base64');
  
        axios.post(
          url,
          {
            BusinessShortCode: '174379',
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: '1',
            PartyA: '254704847676', 
            PartyB: '174379',
            PhoneNumber:  '254704847676', 
            CallBackURL: process.env.CALLBACK_URL,
            AccountReference: 'PARKNWASH',
            TransactionDesc: 'Parking payments',
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


export{getAccessToken, callbackHandler, accessTokenHandler,stkPushHandler}


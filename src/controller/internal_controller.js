import axios  from "axios";
import fs from "fs";


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
  
  var json = JSON.stringify(req.body);
  
  fs.writeFile("stkcallback.json", json, "utf8", function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("STK PUSH CALLBACK JSON FILE SAVED");
  });
  
  console.log(req.body);
};

 function accessTokenHandler  (req, res){
    getAccessToken()
      .then((accessToken) => {
        res.send("😀 Your access token is " + accessToken);
      })
      .catch(console.log);
  };


export{getAccessToken, callbackHandler, accessTokenHandler}


import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { initializeApp } from "firebase/app";
import dotenv from 'dotenv';

dotenv.config();
import paymentsRouter from  './src/routes/payment_routes.js'; // Adjust path as necessary
import internalRouter from  './src/routes/internal_routes.js'; // Adjust path as necessary

 

const app = express();
const port = process.env.PORT || 3000;   


app.use(cors()); 
app.use(json());
app.use(urlencoded({ extended: true }));



app.use('/api', paymentsRouter);  
app.use("/internal", internalRouter)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
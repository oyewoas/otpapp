import express from "express";
import twoFactorRoutes from './routes/twoFactorRoutes';

const app = express();

// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
// app.use(cors());
// Add middleware for parsing JSON and urlencoded data and populating `req.body`
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api/v1', twoFactorRoutes);
app.get('/api/v1', (req,res) => {
  res.json({ message: "Welcome to the two factor authentication exmaple" })
});

const port = 9000;
app.listen(port, () => {
  console.log(`App is running on PORT: ${port}.`);
});
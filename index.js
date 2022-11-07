const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000; //process.env.PORT ||

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bridal Makeover Server Running");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

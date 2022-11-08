const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jvabeue.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//database api
async function run() {
  try {
    const serviceCollection = client
      .db("bridalMakeover")
      .collection("services");

    //services api
    //create
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });
  } catch {}
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Bridal Makeover Server Running");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

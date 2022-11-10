const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");

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
    const reviewCollection = client.db("bridalMakeover").collection("reviews");

    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    //services api
    //create
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    //get all service
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    //get a specific service by id
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    //review
    //create
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const d = new Date();
      review.date = d;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    //get all reviews
    app.get("/reviews", async (req, res) => {
      let query = {};
      console.log("This is from service review", req.query.serviceNo);
      //get review of a specific id
      if (req.query.serviceNo) {
        query = {
          serviceNo: req.query.serviceNo,
        };
      }
      //get all reviews by userid
      if (req.query.userId) {
        query = {
          userId: req.query.userId,
        };
      }
      const sort = { date: -1 };
      const cursor = reviewCollection.find(query).sort(sort);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    app.get("/reviewUpdate/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const myReview = await reviewCollection.findOne(query);
      res.send(myReview);
    });
    app.patch("/reviewUpdate/:id", async (req, res) => {
      const id = req.params.id;
      const updatedReview = req.body.userReview;
      const query = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          userReview: updatedReview,
        },
      };
      const result = await reviewCollection.updateOne(query, updatedDoc);
      res.send(result);
    });
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
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

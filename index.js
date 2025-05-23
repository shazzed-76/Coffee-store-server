const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// mongodb connection string
const uri = `mongodb+srv://${process.env.USER_Name}:${process.env.USER_PASS}@cluster0.dqritdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
        const coffeeCollection = client.db('coffeeDB').collection('coffees');


        app.get("/coffees", async (req, res) => {
          const cursor = coffeeCollection.find();
          const result = await cursor.toArray();
          res.send(result);
        });

        // to provide single coffee data using id
        app.get('/coffees/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await coffeeCollection.findOne(query);
            res.send(result)
        })

        app.post('/coffees', async(req, res) => {
            const coffessData = req.body;            
            const result = await coffeeCollection.insertOne(coffessData);
            res.send(result)
        })

        app.put('/coffees/:id', async(req, res) => {
            const id = req.params.id;
            const newDoc = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };

            const updatedDoc = {
                $set: newDoc
            };

            const result = await coffeeCollection.updateOne(filter, updatedDoc, options);

            res.send(result)
        })

        app.delete('/coffees/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
        })

      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Coffee server is running.....')
});

app.listen(port, () => {
    console.log(`server is listining on port: ${port}`)
})
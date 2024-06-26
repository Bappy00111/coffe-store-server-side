const express = require("express");
const cors = require('cors')
const  app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

// middle waress 

app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)

//-------------- mongo db confige ---------------

// const uri = "mongodb+srv://coffeMaster:DqFf83NWnlUG6Y2x@cluster0.jqnstr5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jqnstr5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const CoffeCollation  = client.db('coffeeDataBase').collection('coffee')

    // get data 
    app.get('/coffee', async(req,res)=>{
      const corsor = CoffeCollation.find();
      const regult = await corsor.toArray();
      res.send(regult)
    })

    // update Data 
    app.get('/coffee/:id',async(req,res)=>{
      const id  = req.params.id;
      const query = {_id:new ObjectId(id)};
      const regult = await CoffeCollation.findOne(query);
      res.send(regult)
    })


    app.put('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)}
      const options = { upsert: true };
      const updateCoffe = req.body;
      const coffe = {
        $set:{
          name:updateCoffe.name,
          quantity:updateCoffe.quantity,
          supplier:updateCoffe.supplier,
          taste:updateCoffe.taste,
          catagore:updateCoffe.catagore,
          detels:updateCoffe.detels,
          photo:updateCoffe.photo,
        }
      }

      const regult = await CoffeCollation.updateOne(filter,coffe,options)
      res.send(regult)
    })

    // delet method 
    app.delete('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)};
      const regult = await CoffeCollation.deleteOne(query);
      res.send(regult);
     
    })

    // post data 
    app.post('/coffe',async(req,res)=>{
      const newCoffe = req.body;
      console.log(newCoffe)
      const regult = await CoffeCollation.insertOne(newCoffe);
      res.send(regult)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/',(req,res)=>{
    res.send('added server')
})


app.listen(port,()=>{
    console.log(`server is suning port ${port}`)
})
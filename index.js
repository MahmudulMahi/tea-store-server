const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middlewire
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8zyyzcn.mongodb.net/?retryWrites=true&w=majority`;

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

    const teaCollection=client.db('teaDB').collection('tea')
    const userCollection=client.db('teaDB').collection('user')

    // tarpor data paowar jonno get method korte hobe

    app.get('/tea',async(req,res)=>{
      const cursor=teaCollection.find();
      const result =await cursor.toArray();
      res.send(result)
    })

    // nirdisto kisu ke update korar jonno
    app.get('/tea/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id:new ObjectId(id)}
      const result=await teaCollection.findOne(query)
      res.send(result);
    })

    // prothome tea add korte hobe
    app.post('/tea',async(req,res)=>{
      // newtea holo from er data je name asbe
      const newTea=req.body;
      console.log(newTea)
      const result =await teaCollection.insertOne(newTea);
      res.send(result)
    })

    // update korar jonno
    app.put('/tea/:id',async(req,res)=>{
      const id=req.params.id
      const filter={_id:new ObjectId(id)}
      const options={upsert:true}
      const updateTea=req.body
      const tea={
        $set:{
          name:updateTea.name,
          chef:updateTea.chef,
          supplier:updateTea.supplier, 
          taste:updateTea.taste, 
          category:updateTea.category, 
          details:updateTea.details, 
          photo:updateTea.photo
        }
      }
      const result=await teaCollection.updateOne(filter,tea,options)
      res.send(result)
    })

    app.delete('/tea/:id',async(req,res)=>{
      const id =req.params.id;
      const query={_id :new ObjectId(id)}
      const result =await teaCollection.deleteOne(query);
      res.send(result)
    })

    // user related apis
    app.get('/user',async(req,res)=>{
      const cursor=userCollection.find()
      const users=await cursor.toArray()
      res.send(users)
    })
    app.post('/user',async(req,res)=>{
      const user=req.body
      console.log(user)
      const result=await userCollection.insertOne(user)
      res.send(result)
    })

    app.patch('/user',async(req,res)=>{
      const user=req.body;
      const filter={email:user.email}
      const updateDoc={
        $set:{
          lastLoggedAt:user.lastLoggedAt
        }
      }
      const result=await userCollection.updateOne(filter,updateDoc)
      res.send(result)
    })

    app.delete('/user/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id:new ObjectId(id)}
      const result=await userCollection.deleteOne(query)
      res.send(result)
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



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
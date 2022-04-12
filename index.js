
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const bodyparser = require("body-parser");
const req = require("express/lib/request");
const res = require("express/lib/response");

const PORT=6000;
const mongo_username='ReemHammoud';
const mongo_password='Reem2542002';
const cluster_id='0';
const db_name='Todo';
const collection_name='tasks';


const uri = "mongodb+srv://ReemHammoud:Reem2542002@cluster0.fyr6p.mongodb.net/Todo?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect((err) => {
  if (err) {
    console.log("Error: " + err.errmsg);
  } else {
    console.log("Connection to database working.");
  }
  client.close();
});

const app=express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.static('public'));
app.get("/task", async (req, res) => {
  client.connect( async (err) => {
      const collection = client.db().collection(collection_name);
      const tasks = await collection.find().toArray();
      console.log("All documents=:"+tasks)
      client.close();
      return res.render("index", { tasks});
    });
  
});

app.post('/task',async (req,res)=>{
  const task ={
     desc:req.body.desc||1,
      
  }
  client.connect( async (err) => {
      const result = await client.db().collection(collection_name).insertOne(task);
      console.log(`Task = ${result.insertedId}`);
      client.close();
      res.redirect("/task");// this will call the app.get('/task') function
    });

});
  
app.delete("/task/:id", async(req, res)=> {
  const {id}=req.params;
  client.connect( async (err) => {
  const result= await client.db().collection(collection_name).deleteOne({id}) ;
    if (err) {
      handleError(res, err.message, "Failed to delete todo");
    } else {
      res.status(204).end();
    }
  });
});

app.put("/task/:id", function(req, res) {
  const id=req.params;
  const updatedvalue={$set:{id:req.body}};
  client.connect( async (err) => {
  const result=await client.db().collection(collection_name).findOneAndUpdate(id, updatedvalue) ;
    if (err) {
      handleError(res, err.message, "Failed to update todo");
    } else {
      res.status(204).end();
    }
 
});
});

// Error handler for the api
function handleError(res, reason, message, code) {
  console.log("API Error: " + reason);
  res.status(code || 500).json({"Error": message});
}

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
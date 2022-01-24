// IMPORT PACKAGES
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// IMPORT MONGOUTIL OBJ
const MongoUtil = require('./MongoUtil');

let app = express();
app.use(express.json());


// ROUTES
async function main(){
   
   await MongoUtil.connect(process.env.MONGO_URI,"Comic_Collection")
   
    app.get('/', function(req,res){ 
        res.send("Hello World");
        })
}
main();

// START SERVER
app.listen(3000, function(req,res){
    console.log("Server Started")
})   
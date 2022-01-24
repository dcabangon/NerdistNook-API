// IMPORT PACKAGES
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');

// IMPORT MONGOUTIL OBJ
const MongoUtil = require('./MongoUtil');

let app = express();
app.use(express.json());

// ENABLE CORS
app.use(cors());


// ROUTES
async function main() {

    await MongoUtil.connect(process.env.MONGO_URI, "Comic_Collection")

    app.get('/', function (req, res) {
        res.json({
            "message": "Hello from my API "
        })
    })

    app.post('/item_entry', async function(req,res){
        const db = MongoUtil.getDB();

        let description = req.body.description;
        let books = req.body.books;
        let date = new Date(req.body.date) || new Date();

        let result = await db.collection('Comic').insertOne({
            'description': description,
            'books': books,
            'date':date
        })
        res.json(result)
    })
}
main();

// START SERVER
app.listen(3000, function (req, res) {
    console.log("Server Started")
})   
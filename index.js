// IMPORT PACKAGES
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');

// IMPORT MONGOUTIL OBJ
const MongoUtil = require('./MongoUtil');
const { ObjectId } = require('mongodb');

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

    app.post('/item_entry', async function (req, res) {
        const db = MongoUtil.getDB();

        let description = req.body.description;
        let book = req.body.books;
        let date = new Date(req.body.date) || new Date();

        try {
            let result = await db.collection('Comic').insertOne({
                'description': description,
                'book': book,
                'date': date
            })
            res.json(result)
        }
        catch (e) {
            res.status(500);
            // 500 = internal server error
            res.json({
                'error': "Failed to add entry"
            })
        }
    })

    // SEARCH - Endpoint
    app.get('/item_entry', async function (req, res) {
        const db = MongoUtil.getDB();
        // db.collection('Comic').find({

        console.log(req.query);

        let criteria = {};

        if (req.query.description) {
            criteria["description"] = {
                '$regex': req.query.description,
                '$options': 'i'
            }
        }

        if (req.query.book) {
            criteria["book"] = {
                "$in": [req.query.book]
            }
        }

        let results = await db.collection('Comic').find(criteria).toArray();
        res.json(results);
    })

    // UPDATE - Endpoint
    app.put('/item_entry/:id', async function (req, res) {
        try {
            await db.collection('Comic').updateOne({
                '_id': ObjectId(req.params.id)
            }, {
                'description': req.body.description,
                'book': req.body.book,
                'date': new Date(req.body.date) || new Date()
            })
            res.json({
                'message': "Success"
            })
        }
        catch (e) {
            res.status(500);
            res.json({
                'message': "Unable to update Entry"
            })
        }
    })

    // DELETE - Endpoint
    app.delete('/item_entry/:id', async function(req,res){
        const db = MongoUtil.getDB();
        await db.collection('Comic').remove({
            '_id':ObjectId(req.params.id)
        })
        res.json({
            'message':"record has been deleted"
        })
    })
}
main();
 
    // START SERVER
    app.listen(3000, function (req, res) {
        console.log("Server Started")
    })
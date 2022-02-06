// IMPORT PACKAGES
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');

// IMPORT MONGOUTIL OBJ
const MongoUtil = require('./MongoUtil');
const { ObjectId } = require('bson');

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
    // INSERT - Endpoint
    app.post('/books', async function (req, res) {
        const db = MongoUtil.getDB();

        let bookName = req.body.bookName;
        let issueNumber = req.body.issueNumber;
        let publisher = req.body.publisher;
        let writer = req.body.writer;
        let imageLink = req.body.imageLink;
        let review = req.body.review;
        let rating = req.body.rating;


        try {
            let result = await db.collection('Comic').insertOne({
                'bookName': bookName,
                'issueNumber': issueNumber,
                'publisher': publisher,
                'writer': writer,
                'imageLink': imageLink,
                'review': review,
                'rating': rating
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
    app.get('/books', async function (req, res) {
        const db = MongoUtil.getDB();

        console.log(req.query);

        let criteria = {};

        if (req.query.bookName) {
            criteria["bookName"] = {
                '$regex': req.query.bookName,
                '$options': 'i'
            }
        }


        if (req.query.issueNumber) {
            criteria["issueNumber"] = {
                '$regex': req.query.issueNumber,
                '$options': 'i'
            }
        }

        if (req.query.publisher) {
            criteria["publisher"] = {
                '$regex': req.query.publisher,
                '$options': 'i'
            }
        }

        if (req.query.writer) {
            criteria["writer"] = {
                '$regex': req.query.writer,
                '$options': 'i'
            }
        }

        if (req.query.imageLink) {
            criteria["imageLink"] = {
                '$regex': req.query.imageLink,
            }
        }

        if (req.query.review) {
            criteria["review"] = {
                '$regex': req.query.review,
                '$options': 'i'
            }
        }

        if (req.query.rating) {
            criteria["rating"] = {
                '$regex': req.query.rating,
                '$options': 'i'
            }
        }
        let results = await db.collection('Comic').find(criteria).toArray();
        res.json(results);
    })

    // SEARCH BY ID - Endpoint
    app.get('/books/:id', async function (req, res) {
        // get instance of Mongo db
        const db = MongoUtil.getDB();
        let result = await db.collection('Comic').findOne({
            '_id': ObjectId(req.params.id)
        });
        res.json({
            'book': result
        })
    })

    // UPDATE - Endpoint
    app.put('/books/:id', async function (req, res) {
        try {
            await db.collection('Comic').updateOne({
                '_id': ObjectId(req.params.id)
            }, {
                'bookName': req.body.bookName,
                'issueNumber': req.body.issueNumber,
                'publisher': req.body.publisher,
                'writer': req.body.writer,
                'imageLink': req.body.imageLink,
                'review': req.body.review,
                'rating': req.body.rating
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

    // UPDATE using API
    app.patch('/books/:id', async (req, res) => {
        const db = MongoUtil.getDB();
        let results = await db.collection('Comic').updateOne({
            '_id': new ObjectId(req.params.id),
        }, {
            '$set': {
                'bookName': req.body.bookName,
                'publisher': req.body.publisher,
                'rating': req.body.rating,
                'imageLink': req.body.imageLink
            }
        })
        res.json({
            'status': true
        })
    })

    // DELETE - Endpoint
    app.delete('/books/:id', async function (req, res) {
        try {
            const db = MongoUtil.getDB();
            await db.collection('Comic').remove({
                '_id': ObjectId(req.params.id)
            })
            res.json({
                'message': "Entry has been deleted"
            })
        }
        catch (e) {
            res.status(500);
            res.json({
                'message': "Unable to delete Entry"
            })
        }
    })
}
main();

// START SERVER
app.listen(process.env.PORT, function (req, res) {
    console.log("Server Started")
})
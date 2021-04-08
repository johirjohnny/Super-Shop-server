const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require("mongodb").ObjectID;

require('dotenv').config()
const port = 5000

const app = express()
app.use(cors());
app.use(bodyParser.json());


const pass = "ArabianHorse79";



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cdrp6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const bookings = client.db("burjAlArab").collection("bookings");
    const ordersCollection = client.db("burjAlArab").collection("orders");

    app.post('/addBooking', (req, res) => {
        const newBooking = req.body;
        bookings.insertOne(newBooking)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addOrder', (req, res) => {
        const newBooking = req.body;
        ordersCollection.insertOne(newBooking)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/products', (req, res) => {
        bookings.find({ email: req.query.email })
            .toArray((err, items) => {
                res.send(items)
                // console.log('from database ', items)
            })
    })

    app.get('/orders', (req, res) => {
        ordersCollection.find({ email: req.query.email })
            .toArray((err, items) => {
                res.send(items)
                // console.log('from database ', items)
            })
    })



    app.get('/bookings', (req, res) => {
        bookings.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.delete("/delete/:id", (req, res) => {
        const id = ObjectId(req.params.id);
        console.log("deleted id", id);
        bookings.findOneAndDelete({ _id: id })
            .then(result => {
                console.log(result);

                res.send(result.deletedCount > 0);

            })
    })
});




app.get('/', (req, res) => {
    res.send('Hello World!')
})




app.listen(process.env.PORT || port)
const express = require('express');
const cors = require('cors');
const MongoUtil = require("./MongoUtil.js");
const { response } = require('express');
const ObjectId = require("mongodb").ObjectId;
const mongoUrl = process.env.MONGO_URI;
require('dotenv').config();




let app = express();
app.use(cors());
app.use(express.json());



async function main() {
    await MongoUtil.connect(process.env.MONGO_URI, "TA-db");
    let db = MongoUtil.getDB();

    app.get('/test-server', (req,res) => {
        console.log("Testing API called")
        res.status(200);
        res.send("Working");
    })

    app.get('/test-db', async (req,res) => {
        console.log("Testing DB called")
        let results = await db.collection("TEST-DB").find().toArray();
        res.json(results)
    })


    app.get('/all-watches', async(req,res) => {
        console.log("Retrieving all watches");
        let results = await db.collection("Watches").aggregate([
            {
                $lookup: {
                    from: "Straps",
                    localField: "strapType",
                    foreignField: "_id",
                    as: "strapType"
                }
            }
        ]).toArray();
        console.log(results)
        res.json(results);
    })




}


main();

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started...")
})




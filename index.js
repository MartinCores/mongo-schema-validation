import express from 'express';
import { MongoClient } from "mongodb";

const app = express()
const cors = require('cors');
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());

const uri = "mongodb+srv://user:pass@cluster0.nuqtv.mongodb.net/sample_mflix?retryWrites=true&w=majority";

const client = new MongoClient(uri);

app.get('/createCollection', (request, response) => {
    create(response).catch(console.dir);
})

async function create(response) {
    try {
        await client.connect();

        const database = client.db("sample_mflix");
        const result = database.createCollection("LRS", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["model", "year"],
                    properties: {
                        model: {
                            bsonType: "object",
                            required: ["brand", "model"],
                            properties: {
                                brand: {
                                    bsonType: "string",
                                    description: "must be an string and it is required"
                                },
                                model: {
                                    bsonType: "string",
                                    description: "must be an string and it is required"
                                }
                            }
                        },
                        year: {
                            bsonType: "int",
                            minimum: 1900,
                            maximum: 2500,
                            description: "must be an integer and it is required"
                        }
                    }
                }
            }
        });

        response.send(result);

    } finally {
        await client.close();
    }
}

app.post('/insert', (request, response) => {

    post(request,response).catch(console.dir);

})

async function post(request, response) {
    try {
        await client.connect();

        const database = client.db("sample_mflix");
        const collection = database.collection("LRS");
        const result = await collection.insertOne(request.body);

        response.send(result);

    } catch(error) {
        response.send(error);
    } finally {
        await client.close();
    }
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const schema = require('./schema/schema');

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true });

mongoose.connection.once('open', () => {
    console.log('Connected to the database');
})

// CORS
app.use(cors({ credentials: true, origin: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
  });

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('Listening on Port 4000');
});
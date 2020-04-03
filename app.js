const express = require('express');
const app = express();

const morgan = require('morgan')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/config');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const userRouts = require('./routes/user')
const employeeRoutes = require('./routes/employee')
const roleRoutes = require('./routes/role')
const cors = require('cors');
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', authRoutes);
app.use('/', userRouts);
app.use('/', employeeRoutes)
app.use('/', roleRoutes)
app.get('/', (req, res) => {
    fs.readFile('docs/apidocs.json', (err, data) => {
        if (err) return res.status(400).json({ error: err })
        const docs = JSON.parse(data)
        res.json(docs);
    })
})

app.use(function (err, req, res, next) {
    if (err.name == 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized' });
    }
})

mongoose.Promise = global.Promise;

const port = 8081;

mongoose.connect(config.mongo.url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("connected >>>> to testSpawn database");
}).catch(err => {
    console.error('App starting error:', err.stack);
    process.exit(1);
});
app.listen(port, () => {
    console.log(`Listning on port ${port}`);
});


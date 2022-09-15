const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes')
const database = require('./mongoose-database.js');

const app = express()
const port = 8082

app.use(cors())
app.use(bodyParser.json())
app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
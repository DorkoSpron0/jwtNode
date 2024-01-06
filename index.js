require('dotenv').config()

const express = require('express');
const app = express();
const morgan = require('morgan')
const cors = require('cors')


// MIDDLEWARE
app.use(cors())

app.use(morgan('dev'))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

// ROUTES
app.use(require('./routes/index.routes.js'))

//ROUTES PERSONALIZADAS API V1
app.use('/api/v1/', require('./routes/apiV1.routes.js'))

// SERVER STARTED
app.listen(8080, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})

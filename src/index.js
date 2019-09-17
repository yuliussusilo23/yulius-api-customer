let express = require('express')
let app = express()
let customerRoute = require('./routes/customer')
//let path = require('path')
let bodyParser = require('body-parser')


app.use(bodyParser.json())
app.use(customerRoute)
app.use(express.static('public'))

app.use((req,res,next) => {
    console.log(new Date().toString() +' => '+req.originalUrl,req.body)
    next()
})

app.use((req,res,next) => {
    res.status(404).send('System Currently Unavailabe')
})

const PORT = process.env.PORT || 9011
app.listen(PORT, () => console.info('Server Has started on '+PORT))
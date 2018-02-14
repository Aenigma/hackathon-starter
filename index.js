const bodyParser = require('body-parser')
const express = require('express')
const MessagingResponse = require('twilio').twiml.MessagingResponse

const PORT = process.env.PORT || 3000

const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const database = [{ From: 'somebody', Body: 'some text message' }]

app.post('/sms', function (req, res) {
    const { From, Body } = req.body
    database.push({ From, Body })

    const mrsp = new MessagingResponse()
    const msg = mrsp.message()
    msg.body('Message has been received! Thanks!')

    res.send(mrsp.toString())
})

app.get('/sms', function (req, res) {
    res.render('index', { data: database })
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

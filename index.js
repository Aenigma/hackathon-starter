const express = require('express')
const bodyParser = require('body-parser')
const app = express()

/* Step 1 */
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
    res.render('index', {
        data: ['foo', 'bar', 'baz']
    })
})

/* Step 1 */
app.post('/sms', function (req, res) {
    // https://www.twilio.com/docs/api/twiml/sms/twilio_request
    const sms = req.body

    console.log(sms)

    const mrsp = new MessagingResponse()
    const msg = mrsp.message()
    msg.body('Message has been received! Thanks!')

    // optional; because default is text/html which is OK for Twilio
    res.set('Content-Type', 'text/xml')
    res.send(mrsp.toString())
})
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

const bodyParser = require('body-parser')
const express = require('express')
const MessagingResponse = require('twilio').twiml.MessagingResponse;

/* Step 3 */
const { Client } = require('pg')
/* End Step 3 */

const PORT = process.env.PORT || 3000

// Deleted in Step 4
// const database = []

const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


/* Step 3 */
// https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js
const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://vrqbujcdgzdqyr:451db879fe8f07189ae69e2570499d80553c882f5a40f9a64938fbc14b941174@ec2-23-21-229-48.compute-1.amazonaws.com:5432/dagc73nh4cr6gf',
    ssl: true,
})
/* Step 3 End */

/* Step 1 */
app.post('/sms', function (req, res) {
    // https://www.twilio.com/docs/api/twiml/sms/twilio_request
    const { From, Body } = req.body

    /* Deleted in step 4
    database.push({ From, Body })
    /* End deleted in step 4 */

    /* Deleted step 2
    res.send("OK")
    /* End deleted in step 2 */


    /* Step 4 */
    client.query('INSERT INTO sms(data) VALUES($1)', [{ From, Body }])
        .then(() => {
            const mrsp = new MessagingResponse()
            const msg = mrsp.message()
            msg.body('Message has been received! Thanks!')

            // optional; because default is text/html which is OK for Twilio
            res.set('Content-Type', 'text/xml')
            res.send(mrsp.toString())
        })
        .catch(err => res.status(500).send(err.message))
    /* Step 4 End */

    /* Step 2; move up in step 4 
    const mrsp = new MessagingResponse()
    const msg = mrsp.message()
    msg.body('Message has been received! Thanks!')

    // optional; because default is text/html which is OK for Twilio
    res.set('Content-Type', 'text/xml')
    res.send(mrsp.toString())
    /* Step 2 End */
})

app.get('/sms', function (req, res) {
    client.query('SELECT data FROM sms').then(results => {
        res.render('index', {
            data: results.rows.map(row => row.data)
        })
    }).catch((err) => res.status(500).send(err.message))

    /* Delete in step 4
    res.render('index', {
        data: database
    })
    /* End delete in step 4*/
})
/* End Step 1 */

/* Step 3 */
app.get('/db/create', function (req, res) {
    // https://node-postgres.com/features/types#uuid-json-jsonb
    const createDBText = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE IF NOT EXISTS sms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        data JSONB
    );`
    client.query(createDBText).then(() =>
        client.query('INSERT INTO sms(data) VALUES($1)', [
            { From: 'Test', Body: 'Seed text' },
        ]))
        .then(() => res.send('OK'))
        .catch(err => res.status(500).send(err.message))
})

app.get('/db/drop', function (req, res) {
    client.query('DROP TABLE IF EXISTS sms')
        .then(() => res.send('OK'))
        .catch((err) => res.status(500).send(err.message))
})

app.get('/db', function (req, res) {
    client.query('SELECT data FROM sms').then(results => {
        res.json(results.rows.map(row => row.data))
    }).catch((err) => res.status(500).send(err.message))
})

client.connect(function (err) {
    if (err) throw err

    client.query('SELECT table_name FROM information_schema.tables;', function (err, res) {
        if (err) throw err
        for (let row of res.rows) {
            console.log(JSON.stringify(row))
        }
    })

})
/* Step 3 End */

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

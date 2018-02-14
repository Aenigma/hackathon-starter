# Hackathon Startpack Steps

This will go over the steps gone through in the application

# Step 0

Go to https://github.com/Aenigma/hackathon-starter/ and clone it, read it, install the dependencies, and run it!
You don't even need a Github account to clone the repo!

    git clone https://github.com/Aenigma/hackathon-starter.git
    cd hackathon-starter
    npm install
    npm start

Hit `Ctrl+C` to stop it

# Step 1

Create a Heroku account and make sure you have the Heroku CLI
Then, invoke: 

    heroku login

Be warned that the first time you do it, it may take some time as it will update itself and you need to issue this command in either command prompt or PowerShell (not Git Bash)

Modify `app.get('/sms/'. ...)` to use `res.render` instead of `res.json`

Run to see that your app displays HTML instead of a JSON response

    npm start

If it works out great, let's create a commit and create a Heroku app

    git add -am "use render instead of json"
    heroku create

Now, let's push:

    git push heroku master

# Step 2

We need setup to accept POST requests from Twilio

Let's install twilio:

    npm install --save twilio

Now, we can create [Twilio responses](https://www.twilio.com/docs/api/twiml/sms/your_response).
These will be used to send something back to the user. You can respond with whatever you like.

1. Make a Twilio account. You may need to make a project.
2. Go to programmable SMS and get a number (any number)
3. Home -> Manager Number -> Click your number -> Change the webhook to for SMS to your yourherokuendpoint.heroku.com/sms
4. Send a text message to your number

It should respond with the message 


# Step 3

Now, we're gonna do set up for Postgres. First, let's install the npm module and then.

    npm install --save pg
    
While that's going on, let's setup Heroku.

1. Go to the Heroku dashboard -> Click your app -> Resources tab -> Type in `postgres` in "Add-ons" and provision it
2. Go to the provisioned Postgres dashboard -> Settings -> View credentials -> Copy the URI

Now, we will write code near the top to authenticate. (Note that this isn't secure, but setting environmental variables in cmd
is kind of a pain, so I elected to just do this for demo purposes)

```javascript
const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://yoursecret',
    ssl: true,
})
```

Copy-paste the following code to just above the `app.listen`. This adds routes to create and manipulate the database, mostly for
example purposes. It's a lot of boiler plate so it makes no sense to write it.

```javascript
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
```

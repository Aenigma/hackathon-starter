const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {
        data: ['foo', 'bar', 'baz']
    })
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

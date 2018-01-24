const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))



app.get('/', (req, res) => {
    res.send("estou navegando")
})

require('./app/controllers/index')(app)


app.listen(8000, (err) => {
    if(err) return console.log(err)
        console.log('estou ouvindo na 8000')
})




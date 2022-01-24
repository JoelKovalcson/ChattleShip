const express = require('express');
const ex_hbs = require('express-handlebars');
const hbs = ex_hbs.create({});
const port = process.env.PORT || 3004;
const path = require('path');

const app = express();


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
// app.set('views', path.join(__dirname, 'views'));


// app.use(express.static(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(require('./controllers/'));

// app.use(express.static('./css/tail-style.css'));

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, './public/index.html'));
    res.render('index'); 
});

app.listen(port, () => {
    console.log(`Server now listening to port ${port}.`);
})

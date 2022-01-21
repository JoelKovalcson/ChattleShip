const express = require('express');
const app = express();
const ex_hbs = require('express-handlebars');
const hbs = ex_hbs.create({});
const port = process.env.PORT || 3004;
const path = require('path');



app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(/*'public',*/'views'));
app.use(express.static('layouts'));
// app.use(express.static('./views/layouts/css'));

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, './public/index.html'));
    res.render('index');
});

app.listen(port, () => {
    console.log(`Server now listening to port ${port}.`);
})

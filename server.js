const path = require('path');
const express = require('express');
const session = require('express-session');
const ex_hbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3004;

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
	secret: 'This should be an environment variable',
	cookie: {},
	resave: false,
	saveUninitialized: true,
	store: new SequelizeStore({
		db: sequelize
	})
};

app.use(session(sess));

const hbs = ex_hbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers'));

// Use {force: true} if rebuilding DB
sequelize.sync({force: false}).then(() => {
	app.listen(PORT, () => {
		console.log(`Server now listening to port ${PORT}.`);
	});
});
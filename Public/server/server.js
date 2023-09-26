const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const helmet = require('helmet'); // for security headers

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

// Middleware for error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

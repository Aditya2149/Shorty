const express = require('express');
const { pool } = require('./database');
const authRoutes = require('./routes/authroute');
const linkRoutes = require('./routes/linkroute');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());

app.use(cookieParser('secretKey'));

app.use('/authroute', authRoutes);

app.use('/', linkRoutes);

app.use((req, res, next) => {
    res.status(404).send('Route not found');
});

const port = 3000;
app.listen(port,'0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});

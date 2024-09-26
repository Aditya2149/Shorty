const express = require('express');
const { pool } = require('./database');
const authRoutes = require('./routes/authroute');
const linkRoutes = require('./routes/linkroute');
const cookieParser = require('cookie-parser');



const app = express();
app.use(express.json());


app.use(cookieParser('secretKey'));
//use auth route
app.use('/authroute', authRoutes);

app.use('/linkroute', linkRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

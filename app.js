const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const musicRoutes = require('./routes/music');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/upload', express.static('upload'));

app.use('/api/music', musicRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(4002, () => {
    console.log(`Server running on http://localhost:4002`);
});
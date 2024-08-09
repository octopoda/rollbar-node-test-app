const express = require('express');
const path = require('path');
const Rollbar = require('rollbar')

const app = express();
const PORT = process.env.PORT || 3000;

var rollbar = new Rollbar({
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
});

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/log-error', (req, res) => {
    const { message, errorType } = req.body;
    console.log('type', errorType);

    if (errorType === 'unhandledException') {
        rollbar.error(`Unhandled Exception: ${message}`);
    } else if (errorType === 'unhandledRejection') {
        rollbar.error(`Unhandled Rejection: ${message}`);
    } else if (errorType === 'handledException') {
        rollbar.info(`Handled Exception: ${message}`);
    }

    res.status(200).send('Error logged to Rollbar');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

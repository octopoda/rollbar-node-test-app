// const Rollbar = require('rollbar')
const Sentry = require('@sentry/node')
const { nodeProfilingIntegration } = require('@sentry/profiling-node')


// var rollbar = new Rollbar({
//     accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
//     captureUncaught: true,
//     captureUnhandledRejections: true,
// });

Sentry.init({ 
    dsn:  process.env.SENTRY_DSN,
    integrations: [
        nodeProfilingIntegration()
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0
})




const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/log-error', (req, res) => {
    const { message, errorType } = req.body;
    console.log('type', errorType);

    if (errorType === 'unhandledException') {
        // rollbar.error(`Unhandled Exception: ${message}`);
        Sentry.captureException(new Error(`Unhandled Exception: ${message}`))
    } else if (errorType === 'unhandledRejection') {
        // rollbar.error(`Unhandled Rejection: ${message}`);
        Sentry.captureException(new Error(`Unhandled Rejection: ${message}`))
    } else if (errorType === 'handledException') {
        // rollbar.info(`Handled Exception: ${message}`);
        Sentry.captureMessage(new Error(`Handled Exception: ${message}`))
    }

    res.status(200).send('Error logged to Rollbar');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Error Handler for Sentry
Sentry.setupExpressErrorHandler(app);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node')

// Initialize Sentry with your DSN (Data Source Name)
Sentry.init({ 
    dsn:  process.env.SENTRY_DSN,
    integrations: [
        nodeProfilingIntegration()
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0
})



export default (req, res) => {
    const { message, errorType } = req.body;

    if (errorType === 'unhandledException') {
        Sentry.captureException(new Error(`Unhandled Exception: ${message}`));
    } else if (errorType === 'unhandledRejection') {
        Sentry.captureException(new Error(`Unhandled Rejection: ${message}`));
    } else if (errorType === 'handledException') {
        Sentry.captureMessage(`Handled Exception: ${message}`, 'info');
    }

    res.status(200).send('Error logged to Sentry');
};

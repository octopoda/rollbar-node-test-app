const Sentry = require('@sentry/node');


// Initialize Sentry with your DSN (Data Source Name)
Sentry.init({ dsn: process.env.SENTRY_DSN });

export default (req, res) => {
    try {
        const { message, errorType } = req.body;

        if (!message || !errorType) {
            throw new Error('Missing message or errorType');
        }

        if (errorType === 'unhandledException') {
            Sentry.captureException(new Error(`Unhandled Exception: ${message}`));
        } else if (errorType === 'unhandledRejection') {
            Sentry.captureException(new Error(`Unhandled Rejection: ${message}`));
        } else if (errorType === 'handledException') {
            Sentry.captureMessage(`Handled Exception: ${message}`, 'info');
        }

        res.status(200).send('Error logged to Sentry');
    } catch (err) {
        console.error('Error in API function:', err);
        Sentry.captureException(err);  // Log this internal error to Sentry
        res.status(500).send('Internal Server Error');
    }
};

const app = require('./app');
const connectDatabase = require('./config/database');


const dotenv = require('dotenv');

const cloudinary = require('cloudinary');



// Prevent Nosql Injection Sanitize Data
const mongoSanitize = require('express-mongo-sanitize');

//XSS Protection "Security Headers"
const helmet = require("helmet");

//
var xss = require('xss-clean')

//Use to limit repeated requests to public APIs and/or endpoints such as password reset. 
const rateLimit = require('express-rate-limit')

// Express middleware to protect against HTTP Parameter Pollution attacks
var hpp = require('hpp');

//Setting up config file
dotenv.config({ path: 'config/config.env'});

// Setting up cloudinary configuration
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server Started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode. `);
});

// Handle Unhandled Promise rejections
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to Unhandled Promise rejection');
    server.close(() => {
        process.exit(1)
    })
})

// Handle Uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1)
})

//Sanitize Data
app.use(mongoSanitize());

//Helmet
app.use(helmet());

//(XSS) is a type of injection attack in which a threat actor inserts data, such as a malicious script
app.use(xss());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

//Express middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp())
const path = require('path');
const express = require('express');
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require('cors');
// const errorHandler = require("./middleware/error");

//Database Connection
// const connectDB = require("./config/db");

//Config file path
dotenv.config({ path: './config/config.env' });

//Connect to database
// connectDB();

//Route files
const instagram = require("./routes/Instagram");

//Express server
const app = express();

//Body parser
app.use(express.json());
// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

//Security
//Sanitize data in mongo
app.use(mongoSanitize());
//Se security headers
app.use(helmet());
//Prevent XSS attacks
app.use(xss());
//Enable CORS
app.use(cors());

//Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 mins,
  //100 reqs per 10 minutes. 
  max: 100
});
app.use(limiter);


//Prevent http param polution
app.use(hpp());

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));  


//Mount Routers
app.use("/api/v1/instagram", instagram);
// app.use('/api/v1/admin', admin);
// app.use('/api/v1/auth', auth);
// app.use('/api/v1/blogs', blogs);
// app.use('/api/v1/comments', comments);

//Error handler middleware
// app.use(errorHandler);

//Run server on PORT or 5000
const PORT = process.env.PORT || 5000;

//Server listener
const server = app.listen(PORT, console.log(`Server running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`.yellow.bold));

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
});
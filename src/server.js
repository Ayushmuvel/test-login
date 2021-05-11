const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middleware/error. middleware');

//adding express 
var app = express();

//system variables
dotenv.config()
const express_port = process.env.Server_Port || 7700;

//body parsera
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//adding middle wear - cors
app.use(cors());

// Set EJS as templating engine  
app.set("view engine", "ejs");

//static files
app.use(express.static(path.join(__dirname, './v1/public/')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

// Error middleware
app.use(errorMiddleware);

//calling routes files
const userRouter = require('./routes/user.route');

// redirecting routes
app.use(`/user`, userRouter);

// end point 

// 404 error
app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);
});

// defining port to listen
app.listen(express_port, () => {
    console.log("server started at port " + express_port);
})
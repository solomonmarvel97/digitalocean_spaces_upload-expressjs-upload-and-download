require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//import exporess routers
const usersRouter = require('./routes/uploads');

const app = express();

app.use(logger('dev'));

// setup json parser
app.use(express.json());
// setup urlencoded parser
app.use(express.urlencoded({ extended: false }));
// setup cookie parser
app.use(cookieParser());
// setup public path
app.use(express.static(path.join(__dirname, 'public')));

// setup upload route
app.use(usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({message: err.message});
});

const PORT = process.env.PORT || 3001
// Start the server
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
});

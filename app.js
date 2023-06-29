var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var carrerasRouter = require('./routes/carreras');
var materiasRouter = require('./routes/materias');




var app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json())



const jwt = require('jsonwebtoken');

const keys = require('./settings/keys');

app.set('key', keys.key);
 

app.get("/", (req, res) => {
  res.send("holaMundo")
})

app.post("/login", (req, res) => {
  if (req.body.usuario == "admin" && req.body.pass == "12345") {
    const payload = {
      check: true
    };
    const token = jwt.sign(payload, app.get('key'), {
      expiresIn: '7d'
    });
    res.json({
      message: '¡AUTENTICACION EXITOSA!',
      token: token
    })
  }else{
    res.json({
      message: 'Usuario y/o contraseña incorrecta'
    })
  }
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/car', carrerasRouter);
app.use('/mat', materiasRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

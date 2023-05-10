const express = require('express');
const app = express();
const router = require('./routes/router');
const home = require('./routes/home');
const login = require('./routes/login');
const registrar = require('./routes/registrar');
const perfil = require('./routes/perfil');
const comunidades = require('./routes/comunidades');
const cookieParser = require('cookie-parser');

app.use(express.static('../frontend'));
app.use(express.json({limit: 10000}));
app.use(express.urlencoded({
  extended: true
}))

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', '../frontend/paginas');

app.use(cookieParser());

app.use(router, (req, res) => {
  res.send('lembra de botar o router novo no app.js');
});
app.use(home);
app.use(login);
app.use(registrar);
app.use(perfil);
app.use(comunidades);

app.listen(3000);
console.log('localhost:3000/');
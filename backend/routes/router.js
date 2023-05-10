const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.js");
const config = require('../modules/config');
const rawg = require('../modules/rawg');

router.get('/', auth.verifyJWT, function(req, res){
    res.render('gamp');
});

router.get('/sair', function(req, res){
    res.clearCookie('token');
    res.redirect('/login'); //talvez mudar pra renderizar a página inicial sem ser login
});

router.post('/pegaNomes', async function (req, res){
    let dados = req.body.dados.trim();
  
    let pesquisa = await config.dbPesquisaNomes(dados);
    res.send({resultado: pesquisa});
});

router.post('/pegaNomesComu', async function(req, res){
    let dados = req.body.dados.trim();

    let pesquisa = await config.dbPesquisaComu(dados);
    res.send({resultado: pesquisa});
})

router.post('/pegaJogos', async function (req, res) {
    let dados = req.body.dados.trim();

    let pesquisa = await rawg.pegaListaJogos(dados, 5);
    res.send({resultado: pesquisa});
});

router.post('/pegaImagem', async function (req, res) {
    let id = req.body.id.trim();

    let img = await rawg.pegaImagem(id);
    res.send({resultado: img});
});

router.post('/criarPost', auth.verifyJWT, async function(req, res) {
    try {
        var usuario = await config.dbReturnUsername(req.userID);
    } catch {
        res.redirect('/home');
        return router;
    }
    let dados = req.body;
    let nomeJogo = dados.nomeJogo;
    let imgJogo = dados.imgJogo;
    let estado = dados.estado;
    let comentario = dados.comentPost;

    await config.dbInsert(`insert into posts values (null, ${req.userID}, "${nomeJogo}", "${comentario}", "${estado}", "${imgJogo}")`);

    res.redirect('/home');
});

router.post('/criarResenha', auth.verifyJWT, async function(req, res) {
    try {
        var usuario = await config.dbReturnUsername(req.userID);
    } catch {
        res.redirect('/home');
        return router;
    }
    let dados = req.body;
    let nomeJogo = dados.nomeJogo;
    let nota = dados.notaJogo;
    let imgJogo = dados.imgJogo;
    let comentario = dados.comentResenha;

    if (nota == '') { nota = 0 }

    await config.dbInsert(`insert into resenhas values (null, ${req.userID}, "${nomeJogo}", ${nota}, "${comentario}", "${imgJogo}")`);

    res.redirect('/home');
});

module.exports = router;
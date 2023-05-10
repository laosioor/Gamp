const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const authConfig = require('../middlewares/auth.json');
const fs = require('fs');

module.exports = {
	getConn: function() {
		var con = mysql.createConnection({
			"host": "127.0.0.1",
			"user": "root",
			//"port": "3307", //para rodar na eletro
			"password": "",
			"database": "gamp"
		})

		con.connect(function(err){
			if (err) throw err;
		})

		return con;
	},

	dbQuery: async function (query, param) {
		var con = this.getConn();
		var data = await con.promise().query(query, param);

		con.end();

		return data[0];
	},

    dbGetSingleRow: async function (query, param) {
        var data = await this.dbQuery(query, param)

        return data[0]
    },

    dbGetSingleValue: async function (query, param, defaultValue) {
        var data = await this.dbGetSingleRow(query, param)

        data = data ?? {}

        data = data.val ?? defaultValue

        return data
    },

    dbInsert: async function (query, param) {
        var con = this.getConn()

        var data = await con.promise().query(query, param)

        con.end()

        return data[0].insertId
	},
	
	generateToken: function (user) {
        return jwt.sign({user}, authConfig.secret, {
            noTimestamp: true,
            expiresIn: 86400
        });

        
    },

	dbValidateUsername: async function (username) {
        var con = this.getConn()
        var dbRsp = await this.dbGetSingleValue("select count(*) as val from usuarios where nomeUsuario=?", [username])
        

        if (dbRsp === 0) {
            con.end()
            return false
        } 
        con.end()
        return true;
	},

    dbValidateComunidade: async function (comu) {
        var con = this.getConn()
        var dbRsp = await this.dbGetSingleValue("select count(*) as val from comunidades where nomeComunidade=?", [comu])
        

        if (dbRsp === 0) {
            con.end()
            return false
        } 
        con.end()
        return true;
    },

	dbReturnUsername: async function (id) {
        var con = this.getConn()
        var dbRsp = await this.dbGetSingleRow("select (nomeUsuario) from usuarios where idUsuario=?",[id])

        
        if (dbRsp === 0) {
            con.end()
            return false
        }
        con.end()
        return dbRsp["nomeUsuario"];
    },

    dbReturnUserID: async function (user) {
        var con = this.getConn()
        var dbRsp = await this.dbGetSingleRow("select (idUsuario) from usuarios where nomeUsuario=?",[user])

        
        if (dbRsp === 0) {
            con.end()
            return false
        }
        con.end()
        return dbRsp["idUsuario"];
    },

    dbReturnUserInfo: async function (id) {
        var con = this.getConn()
        var dbRsp = await this.dbGetSingleRow("select nomeUsuario, bioUsuario, imgUsuario from usuarios where idUsuario=?",[id])

        
        if (dbRsp === 0) {
            con.end()
            return false
        }
        con.end()
        return dbRsp;
    },

    dbReturnComuID: async function (comu) {
        var con = this.getConn()
        var dbRsp = await this.dbGetSingleRow("select (idComunidade) from comunidades where nomeComunidade=?",[comu])

        
        if (dbRsp === 0) {
            con.end()
            return false
        }
        con.end()
        return dbRsp["idComunidade"];
    },

    dbPesquisaNomes: async function (nome) {
        var con = this.getConn();
        
        var dbRsp = await this.dbQuery("select (nomeUsuario) from usuarios where nomeUsuario like ? limit 10", [nome + '%']);

        var nomes = [];

        for (let i = 0; i < dbRsp.length; i++) {
            nomes.push(dbRsp[i]["nomeUsuario"]);
        }
        con.end();
        return nomes;
    },

    dbPesquisaComu: async function (nome) {
        var con = this.getConn();
        
        var dbRsp = await this.dbQuery("select (nomeComunidade) from comunidades where nomeComunidade like ? limit 10", [nome + '%']);

        var nomes = [];

        for (let i = 0; i < dbRsp.length; i++) {
            nomes.push(dbRsp[i]["nomeComunidade"]);
        }
        con.end();
        return nomes;
    },

    numAleatorio: function() {  
        return Math.floor(
          Math.random() * (1000 - 1 + 1) + 1
        )
    },

    segue: async function (idOutro, idAtual) {
        var con = this.getConn();
        
        var dbRsp = await this.dbGetSingleRow("select * from seguidores where idSeguidor = ? and idSeguindo = ?", [idAtual, idOutro]);

        con.end();
        if (dbRsp === 0 || dbRsp == undefined) {
            return "nao";
        } else {
            return "sim";
        }
    },

    returnTotalSeguindo: async function(id) {
        var con = this.getConn();
        
        var dbRsp = await this.dbGetSingleRow("select count(idSeguindo) as totalSeguindo from seguidores where idSeguidor = ?", [id]);
        dbRsp = `${dbRsp["totalSeguindo"]} Seguindo`;

        
        con.end();
        return dbRsp;
    },

    returnTotalSeguidores: async function(id) {
        var con = this.getConn();
        
        var dbRsp = await this.dbGetSingleRow("select count(idSeguidor) as totalSeguidores from seguidores where idSeguindo = ?", [id]);
        dbRsp = dbRsp["totalSeguidores"];

        if (dbRsp == 1) {
            dbRsp = `${dbRsp} Seguidor`
        } else {
            dbRsp = `${dbRsp} Seguidores`
        }

        con.end();
        return dbRsp;
    }
}
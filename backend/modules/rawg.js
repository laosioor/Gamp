const key = '69753b124d04475aa0b200ac24590e8d';
const request = require('request');

module.exports = {
    pegaListaJogos: async function(nome, qtd) {
        nome = nome.split(' ').join('+');
        var jogos = [];
        let url = `https://api.rawg.io/api/games?key=${key}&search=${nome}&page_size=${qtd}`;

        info = await new Promise(function(resolve, reject) {
            request(url, function(error, response, body) {
            if (error) reject(error);

            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body));
            }});
        });

        let size = Object.keys(info.results).length;
        if (size < 0) {
            return false
        }

        for(let i = 0; i < size; i++) {
            jogos.push([info.results[i].name, info.results[i].id]);
        }   
        return jogos;
    },

    pegaImagem: async function(id) {
        let url = `https://api.rawg.io/api/games/${id}?key=${key}`;

        info = await new Promise(function(resolve, reject) {
            request(url, function(error, response, body) {
                if (error) reject(error);

                if (!error && response.statusCode == 200) {
                    resolve(JSON.parse(body));
                }
            });
        });

        let img = info.background_image;
        return img;
    }
}
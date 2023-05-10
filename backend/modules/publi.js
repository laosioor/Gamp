const config = require("./config");

module.exports = {
    reajustePubli: async function(sourceArray) {
        for (var i = 0; i < sourceArray.length - 1; i++) {
            var j = i + Math.floor(Math.random() * (sourceArray.length - i));
    
            var temp = sourceArray[j];
            sourceArray[j] = sourceArray[i];
            sourceArray[i] = temp;
        }
        return sourceArray;
    },

    totalPubli: async function(id) {
        var total = await config.dbGetSingleRow("select count(*) as totPost, (select count(*) from resenhas where idPublicador = ?) as totRes from posts where idPublicador = ?", [id, id]);

        total = total["totPost"] + total["totRes"];

        switch(total) {
            case 1:
                total = `${total} Publicação`;
                break;
            default:
                total = `${total} Publicações`;
                break;
        }
        return total;
    }
}
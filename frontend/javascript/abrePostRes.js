var post = document.getElementById("postDiv");
var esq = document.getElementById("esqDiv");
var dir = document.getElementById("dirDiv");
var res = document.getElementById("resDiv");
function abrirPost() {
    if (post.style.display === "none") {
        post.style.display = "block";
        esq.style.display = "none";
        dir.style.display = "none";
    } else {
        esq.style.display = "block";
        dir.style.display = "block";
        post.style.display = "none";
    }
}

function abrirRes() {
    if (res.style.display === "none") {
        res.style.display = "block";
        esq.style.display = "none";
        dir.style.display = "none";
    } else {
        esq.style.display = "block";
        dir.style.display = "block";
        res.style.display = "none";
    }
}

function abrirBotoes() {
    esq.style.display = "block";
    dir.style.display = "block";
    res.style.display = "none";
    post.style.display = "none";
}
function selecionaJogo(e) {
    if (post.style.display === 'block')
    {
        var results = document.getElementById("resultadosJogoE");
        var input = inputJogoE;
        var imgJogo = document.getElementById("imgJogoE");
    } 
    if (res.style.display === 'block') {
        var results = document.getElementById("resultadosJogoD");
        var input = inputJogoD;
        var imgJogo = document.getElementById("imgJogoD");
    }
    results.innerHTML = "";
    input.value = e.target.innerHTML; //define o value de input como sendo o nome do jogo, no caso o texto da opção selecionada.
    fetch('pegaImagem', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: e.target.value})}).then(res => res.json()).then(data => {
            let img = data.resultado;
            
            
            imgJogo.value = img;
            //tem que pegar o input hidden e depois bota img como value dele :)
            //inserir elemento pra adicionar a imagem.appendChild(blocoImg);
        });
        
}
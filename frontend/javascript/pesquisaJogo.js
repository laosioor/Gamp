function enviaDadosJogo(e) {
    if (post.style.display === 'block')
    {
        resultadosJogo = document.getElementById('resultadosJogoE');
        
    } 
    if (res.style.display === 'block') {
        resultadosJogo = document.getElementById('resultadosJogoD');
    }

    

    let match = e.value.match(/^[\w&.\- ]+$/);
    let match2 = e.value.match(/\s*/);
    if (match2[0] === e.value) {
        resultadosJogo.innerHTML =''; 
        return;
    }
    if (match[0] === e.value) {
        fetch('pegaJogos', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({dados: e.value})
        }).then(res => res.json()).then(data => {
            let resultado = data.resultado;
            resultadosJogo.innerHTML = '';
            if (resultado.length < 1) {
                resultadosJogo.innerHTML = '<p>Nenhum Jogo Encontrado.</p>';
                return
            }
            resultado.forEach((item, index) => {
                var opt = document.createElement('option');
                opt.value = item[1];
                opt.innerHTML = item[0];
                opt.addEventListener("click", selecionaJogo);
                //if (index > 0) resultadosJogo.innerHTML += '<hr>';
                //resultadosJogo.appendChild(`<option value="${item[1]} onclick="selecionaJogo(this)">${item[0]}</option>"`);
                resultadosJogo.appendChild(opt);
                //console.log(resultadosJogo);
                //`<p>${item}</p>`; 
            });
        });
        return;
    }
    resultadosJogo.innerHTML = '';
}
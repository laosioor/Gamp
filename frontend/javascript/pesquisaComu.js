function enviaDados(e) {
    const resultadosNome = document.getElementById("resultadosNome");
    
    let match = e.value.match(/^[\w&.\- ]+$/);
    let match2 = e.value.match(/\s*/);
    if (match2[0] === e.value) {
        resultadosNome.innerHTML =''; 
        resultadosNome.style.height = "0px";
        return;
    }
    if (match[0] === e.value) {
        fetch('pegaNomesComu', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({dados: e.value})
        }).then(res => res.json()).then(data => {
            let resultado = data.resultado;
            resultadosNome.innerHTML = '';
            if (resultado.length < 1) {
                let tam = 30;
                resultadosNome.style.height = `${tam}px`;
                resultadosNome.innerHTML = '<p class="resultsP">Nada encontrado.</p>';
                return;
            }
            resultado.forEach((item, index) => {
                let tam = 30 * resultado.length;
                resultadosNome.style.height = `${tam}px`;
                resultadosNome.innerHTML += `<a href='/perfil/${item}'><p class="resultsP clickable">${item}</p></a>`;
            });
        });
        return;
    }
    resultadosNome.style.height = "0px";
    resultadosNome.innerHTML = '';	
}
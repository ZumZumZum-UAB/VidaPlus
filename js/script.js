

window.onload=encher()
AOS.init({
            once: true, // A animação roda apenas uma vez
            offset: 10 // Começa a animar 100px antes do elemento aparecer
        });

function encher(){
    const barras = document.querySelectorAll('.skill-fill')
    barras.forEach(barra => {
    barra.style.width = '100%';
    barra.style.transform = 'translateX(110%)';
});

    console.log("Deu certo")
    setTimeout(esvaziar, 1000)
}

function esvaziar(){
    const barras = document.querySelectorAll('.skill-fill')
    barras.forEach(barra => {
    barra.style.transition = '1s ease-in-out'
    barra.style.width = '0%';
    barra.style.width = '1s ease-in-out'
    barra.style.transform = 'translateX(-112%)';
    barra.style.transition = 'width 1s ease-in-out'
  

});
  setTimeout(encher, 1000)
    
}

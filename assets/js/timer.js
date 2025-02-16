const display = document.getElementById('display');
let timer = null;
let debutTimer = 0;
let finTimer = 0;
let enCours = false

function start() {
    if (!enCours) {
        debutTimer = Date.now() - finTimer;
        timer = setInterval(update, 10);
        enCours = true;
    }
    console.log(debutTimer);
}

function stop() {
    if (enCours) {
        clearInterval(timer);
        finTimer = Date.now() - debutTimer;
        enCours = false;
        localStorage.setItem('tempsRestant', finTimer);
    }
}

function reset() {
    clearInterval(timer);
    debutTimer = 0;
    finTimer = 0;
    enCours = false;
    display.textContent = '00:00:00:00'
    localStorage.setItem('tempsRestant', 0);
}

function update() {
    const tempsActuel = Date.now();
    finTimer = tempsActuel - debutTimer;

    let heures = Math.floor(finTimer / (1000 * 60 * 60));
    let minutes = Math.floor((finTimer / (1000 * 60)) % 60);
    let secondes = Math.floor(finTimer / 1000 % 60);
    let millisecondes = Math.floor(finTimer % 1000 / 10);

    heures = String(heures).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    secondes = String(secondes).padStart(2, '0');
    millisecondes = String(millisecondes).padStart(2, '0');

    display.textContent = `${heures}:${minutes}:${secondes}:${millisecondes}`
    localStorage.setItem('tempsRestant', finTimer);
}

// Si le tempsRestant (qu'on récup la haut, avec un localStorage) n'est pas null, alors on récup la donnée stocké dans le storage et on relance le timer grâce au enCours = true; Dans l'autre cas (else), on affiche 00:00
window.onload = function () {
    let tempsRestant = localStorage.getItem('tempsRestant');
    if (tempsRestant) {
        debutTimer = Date.now() - tempsRestant;
        timer = setInterval(update, 10);
        enCours = true;
    } else {
        display.textContent = '00:00:00:00';
    }
};
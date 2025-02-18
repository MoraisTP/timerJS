//Mes variable, je récup display (00:00..), le timer est null, je recup l'input gr^ce aux ids heures, minutes, secondes, millisecondes puis je crée une nouvelle date avec, je stock cette donnée sur un localStockage
const display = document.getElementById('display');
let timer = null;
let recupInput = 0;
let enCours = false;
let tempsRestant = 0

function start() {
    if (!enCours) {
        if (tempsRestant > 0) {
            recupInput = new Date().getTime() + tempsRestant;
        } else {
        const heures = parseInt(document.getElementById('heures').value) || 0;
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const secondes = parseInt(document.getElementById('secondes').value) || 0;
        const millisecondes = parseInt(document.getElementById('millisecondes').value) || 0;

        recupInput = new Date().getTime() + (heures * 60 * 60 * 1000) + (minutes * 60 * 1000) + (secondes * 1000) + millisecondes;
    }
        localStorage.setItem('recupInput', recupInput);
        localStorage.removeItem('tempsRestant');

        timer = setInterval(update, 10);
        enCours = true;
    }
}
// fonct qui permet de stop le minuteur
function stop() {
    if (enCours) {
        clearInterval(timer);
        enCours = false;

        const now = new Date().getTime();
        tempsRestant = recupInput - now;
        localStorage.setItem('tempsRestant', tempsRestant);
    }

}
// fonct qui reset le minuteur
function reset() {
    clearInterval(timer);
    recupInput = 0;
    tempsRestant = 0;
    enCours = false;
    display.textContent = '00:00:00:00';
    localStorage.removeItem('recupInput');
    localStorage.removeItem('tempsRestant');
}

//fonct qui update le temps
function update() {
    const now = new Date().getTime();
    const difference = recupInput - now;

    // Si le temps est écoulé j'ffiche un messge
    if (difference < 0) {
        display.textContent = "Terminé !";
        clearInterval(timer);
        enCours = false;
        localStorage.removeItem('recupInput');
        localStorage.removeItem('tempsRestant');
        return;
    }

    let heures = Math.floor(difference / (1000 * 60 * 60));
    let minutes = Math.floor((difference / (1000 * 60)) % 60);
    let secondes = Math.floor((difference / 1000) % 60);
    let millisecondes = Math.floor((difference % 1000) / 10);

    heures = String(heures).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    secondes = String(secondes).padStart(2, '0');
    millisecondes = String(millisecondes).padStart(2, '0');

    display.textContent = `${heures}:${minutes}:${secondes}:${millisecondes}`;
}
//rechargement de la pge
window.onload = function () {
    display.textContent = '00:00:00:00';

    const saveRecupInput = localStorage.getItem('recupInput');
    const saveTempsRestant = localStorage.getItem('tempsRestant');

    if (saveRecupInput) {
        recupInput = parseInt(saveRecupInput);
        timer = setInterval(update, 10);
        enCours = true;
    } else if (saveTempsRestant) {
        tempsRestant = parseInt(saveTempsRestant);
    }
};

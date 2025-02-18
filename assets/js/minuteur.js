//Mes variable, je récup display (00:00..), le minuteur est null, je recup l'input gr^ce aux ids heures, minutes, secondes, millisecondes puis je crée une nouvelle date avec, je stock cette donnée sur un localStockage
const display = document.getElementById('display');
let minuteur = null;
let recupInput = 0;
let enCours = false;
let tempsRestant = 0
// La fonction minuteur permet (grâce à mathfloor) d'avoir les heures, minutes et secondes'
function converti(difference) {
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
// La fonction start vérifie si le compteur est en cours et dans le premier cas (temps restant >0), il relance puis en deuxième (else), il lance le compteur de base
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
        localStorage.setItem('tempsRestant', recupInput - new Date().getTime());
        localStorage.setItem('etat', 'running');

        clearInterval(minuteur);
        minuteur = setInterval(update, 10);
        enCours = true;
    }
}
// fonct qui permet de stop le minuteur, on save avec loclstorage
function stop() {
    if (enCours) {
        clearInterval(minuteur);
        enCours = false;

        tempsRestant = recupInput - new Date().getTime();
        localStorage.setItem('tempsRestant', tempsRestant);
        localStorage.setItem('etat', 'stop');
    }

}
// fonct qui reset le minuteur, on clearIntervl et on remet le tout à 0 + on clear le local storage
function reset() {
    clearInterval(minuteur);
    recupInput = 0;
    tempsRestant = 0;
    enCours = false;
    display.textContent = '00:00:00:00';
    localStorage.clear();
}

//fonct qui update le temps
function update() {

    const maintenant = new Date().getTime();
    const difference = recupInput - maintenant;

    // Si le temps est écoulé j'ffiche un messge
    if (difference < 0) {
        display.textContent = "Terminé !";
        clearInterval(minuteur);
        enCours = false;
        localStorage.clear();
        return;
    }

    converti(difference)
}
//rechargement de la pge
window.onload = function () {
    display.textContent = '00:00:00:00';

    const saveTempsRestant = localStorage.getItem('tempsRestant');
    const etat = localStorage.getItem('etat');


    if (saveTempsRestant && etat === 'stop') {
        tempsRestant = parseInt(saveTempsRestant);
        converti(tempsRestant);
    } else if (etat === 'running') {
        start()
    }
};

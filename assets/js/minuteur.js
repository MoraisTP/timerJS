// Mes variables (je recup display, barre de progression et le son du minuteur) + je défini enCours comme false (il n'est pas lancé) le tempRestant est égal à 0
const display = document.getElementById('display');
let minuteur;
let recupInput = 0;
let enCours = false;
let tempsRestant = 0;
const barProgression = document.getElementById('barProgression');
const finTimerSon = document.getElementById('finTimerSon');

// Fonction pour mettre à jour la barre de progression, elle a une condition if qui vérifie si le temps total est supérieur puis se lance. Elle  calcule le temps total - diferance pour avoir le temps écoulé jusqu'à présent puis calcule la progression de la barre (tempsparcourru / temps total *100), à la fin on récup la value et on s'assure avec math.min et math.max que la progession ne dépasse pas 100
function updateProgression(difference) {
    const tempsTotal = recupInput - parseInt(localStorage.getItem('debutMinuteur'));

    if (tempsTotal > 0) {
        const tempsParcourru = tempsTotal - difference;
        let progression = (tempsParcourru / tempsTotal) * 100;

        barProgression.value = Math.min(Math.max(progression, 0), 100);
        localStorage.setItem('progressionBar', progression.toString());
    } else {
        barProgression.value = 100;
        localStorage.setItem('progressionBar', '100');
    }
}

// Fonction de conversion (millisecondes) on converti les données en string (chaine de caravtères)et on l'affiche sur le display au format hh::mm::ss::mms. On change la couleur du background si le temps est inférieur à 1000ms (10sec)
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
    if (difference < 10000) {
        display.style.backgroundColor = "red";
        display.style.transition = "500ms ease";
        display.style.borderRadius = "15px";
    } else {
        display.style.backgroundColor = "";
    }
}

// Fonction pour démarrer le minuteur, si le temps restant est supérieur à 0 alors elle 'reprend' le compteur. En deuxième (else) elle récupere la value (input) de l'utilisateur et crée une new Date avec. Pour terminer on stock les données grâce au localStorage (récup input, temps restant, debut minuteur et etat), on clear l'interval pour éviter les conflits, on appele update toutes les 10ms et on change enCours en true.
function start() {
    if (!enCours) {
        if (tempsRestant > 0) {
            recupInput = new Date().getTime() + tempsRestant;
            barProgression.value = (localStorage.getItem('progression'));
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
        localStorage.setItem('debutMinuteur', new Date().getTime());

        clearInterval(minuteur);
        minuteur = setInterval(update, 10);
        enCours = true;
    }
}

// Fonction pour arrêter le minuteur, si en cours on passe > enCours = false, on calcule le temps restant et on stock les données dans un localstroage
function stop() {
    if (enCours) {
        clearInterval(minuteur);
        enCours = false;
        const progressionSauvegardee = localStorage.getItem('progressionBar');
        if (progressionSauvegardee !== null) {
            barProgression.value = parseFloat(progressionSauvegardee);
        }
        tempsRestant = recupInput - new Date().getTime();
        localStorage.setItem('tempsRestant', tempsRestant);
        localStorage.setItem('etat', 'stop');
        localStorage.setItem('progression', barProgression.value);
    }
}

// Fonction pour réinitialiser le minuteur, elle remet le tout à 0
function reset() {
    clearInterval(minuteur);
    recupInput = 0;
    tempsRestant = 0;
    enCours = false;
    display.textContent = '00:00:00:00';
    localStorage.clear();
    barProgression.value = 0;
    display.style.backgroundColor = "";
}

// Fonction de mise à jour du minuteur, si le timer est inférieur à 0 on affiche terminé + on joue un son.
function update() {
    const maintenant = new Date().getTime();
    const difference = recupInput - maintenant;
    const progressionSauvegardee = localStorage.getItem('progressionBar');
    if (progressionSauvegardee !== null) {
        barProgression.value = parseFloat(progressionSauvegardee);
    }
    if (difference < 0) {
        display.textContent = "Terminé !";
        clearInterval(minuteur);
        enCours = false;
        localStorage.clear();
        finTimerSon.play();
        return;
    }

    // Mets à jour l'affichage du temps et la barre de progression
    converti(difference);
    updateProgression(difference);
}

// Au rechargement de la page, on recup le temps restant, selon la condition (temps restant et etat stop) on recup le tems restant et on l'affiche grâce à converti()
//else if > si il est en etat 'running' (en cours), on calcule le temps de l'input - le tems mintenant (getTime), on utilise converti() pour l'afficher.
window.onload = function () {
    display.textContent = '00:00:00:00';

    const saveTempsRestant = localStorage.getItem('tempsRestant');
    const etat = localStorage.getItem('etat');
    const recupInput = localStorage.getItem('recupInput');
    const progressionSauvegardee = localStorage.getItem('progressionBar');
    if (progressionSauvegardee !== null) {
        barProgression.value = parseFloat(progressionSauvegardee);
    }
    if (saveTempsRestant && etat === 'stop') {
        tempsRestant = parseInt(saveTempsRestant);
        converti(tempsRestant);
    } else if (etat === 'running') {
        tempsRestant = parseInt(recupInput) - new Date().getTime();
        converti(tempsRestant);
    }
};


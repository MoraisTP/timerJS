const display = document.getElementById('display');
let timer = null;
let targetDate = 0;
let enCours = false;

function start() {
    if (!enCours) {
        const heures = parseInt(document.getElementById('heures').value) || 0;
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const secondes = parseInt(document.getElementById('secondes').value) || 0;
        const millisecondes = parseInt(document.getElementById('millisecondes').value) || 0;

        targetDate = new Date().getTime() + (heures * 60 * 60 * 1000) + (minutes * 60 * 1000) + (secondes * 1000) + millisecondes;

        localStorage.setItem('targetDate', targetDate);

        timer = setInterval(update, 10);
        enCours = true;
    }
}

function stop() {
    if (enCours) {
        clearInterval(timer);
        enCours = false;
    }
}

function reset() {
    clearInterval(timer);
    targetDate = 0;
    enCours = false;
    display.textContent = '00:00:00:00';
    localStorage.removeItem('targetDate');
}

function update() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    // Si le temps est écoulé
    if (difference < 0) {
        display.textContent = "Terminé !";
        clearInterval(timer);
        enCours = false;
        localStorage.removeItem('targetDate');
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

window.onload = function () {
    display.textContent = '00:00:00:00';

    const savedTargetDate = localStorage.getItem('targetDate');
    if (savedTargetDate) {
        targetDate = parseInt(savedTargetDate);
        timer = setInterval(update, 10);
        enCours = true;
    }
};

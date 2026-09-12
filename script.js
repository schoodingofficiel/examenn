(function() {
    // === 1. NETTOYAGE DES INTERVALLES PRÉCÉDENTS ===
    let id = window.setInterval(function() {}, 0);
    while (id--) { window.clearInterval(id); window.clearTimeout(id); }

    // === 2. CONFIGURATION DYNAMIQUE ===
    const displayedName = prompt("Nom à afficher ?", "Paul Clairembault") || "Élève";
    const numberOfExercises = Math.max(0, parseInt(prompt("Combien d'exercices au total ? (1-12)")) || 0);
    
    const exercisePoints = [];
    for (let i = 1; i <= numberOfExercises; i++) {
        let pts = prompt(`Points pour l'ex ${i} ?`, "2");
        exercisePoints.push(pts + "pts"); // Ajout automatique du suffixe
    }

    // Sélection des QCM
    const qcmInput = prompt("Quels numéros sont des QCM ? (ex: 2,5,8) - Laissez vide si aucun");
    const qcmList = qcmInput ? qcmInput.split(',').map(n => parseInt(n.trim())) : [];

    const h = parseInt(prompt("Heures restantes ?", "1")) || 0;
    const m = parseInt(prompt("Minutes restantes ?", "30")) || 0;
    const totalSeconds = (h * 3600) + (m * 60);
    const endTime = Date.now() + (totalSeconds * 1000);

    // === 3. MISE À JOUR DE L'INTERFACE PARENTE ===
    const nameSpan = document.querySelector("#time .small i") || document.querySelector("#time .small");
    if (nameSpan) nameSpan.innerHTML = `<span style="font-style: italic;">${displayedName}</span>`;

    const navTabs = document.querySelector(".nav-tabs");
    const countdownElement = document.querySelector(".countdown");

    if (navTabs) {
        navTabs.querySelectorAll(".nav-exo").forEach((link, i) => {
            const exoNum = i + 1;
            if (i < numberOfExercises) {
                link.classList.remove("disabled");
                link.style.display = "inline-block";
                link.style.cursor = "pointer";
                link.setAttribute("data-toggle", "tab");

                // Mise à jour du texte "Ex X"
                link.childNodes.forEach(n => { 
                    if(n.nodeType === 3 && n.textContent.includes('Ex')) n.textContent = ` Ex ${exoNum}`;
                });

                // Mise à jour des points
                if (link.querySelector("small")) link.querySelector("small").textContent = exercisePoints[i];

                // Icône dynamique : Case à cocher pour QCM, Code pour les autres
                const icon = link.querySelector(".material-icons");
                if (icon) {
                    icon.textContent = qcmList.includes(exoNum) ? "check_box" : "code";
                }
            } else {
                link.style.display = "none";
            }
        });
    }

    // === 4. LOGIQUES DE COULEUR (SOURCES OFFICIELLES) ===
    
    // Fonction quadratique extraite de progressbar_autocolor.js [cite: 1, 2, 3]
    function hsl_col_perc(percent, start, end, s, l) {
        if (percent > 100) percent = 100;
        let a = percent / 100,
            b = (end - start) * a * a, // Courbe Schooding 
            c = b + start;
        return `hsl(${c}, ${s}%, ${l}%)`;
    }

    function render() {
        const now = Date.now();
        const diff = endTime - now;
        const remaining = Math.max(0, Math.floor(diff / 1000));
        const percent = (diff / (totalSeconds * 1000)) * 100;

        // A. Couleur de la barre (Heure réelle / 10000) 
        const timeHue = (now / 10000) % 360; 
        const navColor = `hsl(${timeHue}, 100%, 30%)`; 
        const activeColor = `hsl(${timeHue}, 100%, 40%)`; 

        if (navTabs) {
            navTabs.style.backgroundColor = navColor;
            navTabs.querySelectorAll(".nav-link").forEach(link => {
                link.style.setProperty("background-color", link.classList.contains("active") ? activeColor : navColor, "important");
            });
        }

        // B. Couleur du Chrono (Vert -> Rouge selon progression) [cite: 1]
        if (countdownElement) {
            countdownElement.style.color = "white";
            
            let hours = Math.floor(remaining / 3600);
            let mins = Math.floor((remaining % 3600) / 60);
            let secs = remaining % 60;
            countdownElement.innerText = `${hours}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
        }

        if (diff > 0) {
            requestAnimationFrame(render);
        } else {
            if (countdownElement) countdownElement.innerText = "Temps écoulé !";
            // Simulation du blocage final 
            document.querySelectorAll(".nav-link").forEach(l => l.classList.add("disabled"));
        }
    }

    render();
})();

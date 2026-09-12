/**
 * SIMULATION GLOBALE DE COMPILATION SCHOODING
 * Ce script s'exécute dans la page parente et gère les iframes.
 */

function setupGlobalSimulation() {
    // On surveille le chargement de chaque iframe
    $('.exoIframe').on('load', function() {
        const iframeWindow = this.contentWindow;
        const iframeDoc = $(this.contentDocument);
        const exoId = $(this).attr('data-exoId');

        // On remplace la fonction submit() à l'intérieur de l'exercice
        iframeWindow.submit = function() {
            simulateCompilation(iframeDoc, exoId);
        };
    });
}

function simulateCompilation(doc, exoId) {
    const runBtn = doc.find("#runBtn");
    const progressContent = doc.find("#progressContent");
    const resultContent = doc.find("#resultContent");
    const progressBar = progressContent.find(".progress-bar");

    // 1. État initial (Compilation...)
    runBtn.prop('disabled', true);
    runBtn.html('<span class="material-icons">hourglass_empty</span> Compilation...');
    
    resultContent.hide();
    progressContent.show();
    progressBar.css("width", "0%");

    let progress = 0;
    
    // 2. Animation de la barre (Logique irrégulière pour le réalisme)
    let interval = setInterval(function() {
        progress += Math.random() * 20; 
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Délai avant d'afficher le succès final
            setTimeout(() => {
                showSuccess(doc, runBtn, progressContent, resultContent, exoId);
            }, 600);
        }
        progressBar.css("width", progress + "%");
        progressBar.attr("aria-valuenow", progress);
    }, 350);
}

function showSuccess(doc, btn, loader, results, exoId) {
    loader.hide();
    
    // Contenu de succès basé sur vos extraits HTML
    const successHtml = `
        <div class="list-group-item list-group-item-success py-2">
            <span class="material-icons text-success">check_circle</span> Compilation réussie
        </div>
        <div class="list-group-item list-group-item-success py-2">
            <span class="material-icons text-success">check_circle</span> Test 1 : Validator réussi
        </div>`;
    
    doc.find("#resultContentBody").html(successHtml);
    results.fadeIn();

    // Rétablir le bouton
    btn.prop('disabled', false);
    btn.html('<span class="material-icons">play_circle_outline</span> Exécuter');

    // 3. Mise à jour synchronisée de la barre de navigation parente 
    // On utilise la fonction officielle d'ExamManager
    if (typeof updateProgressions === "function") {
        updateProgressions(exoId, 100); [cite: 24]
    }
    
    // Mise à jour visuelle locale (icône de sauvegarde)
    doc.find(".exoSave").html("check_circle").css("color", "#28a745"); [cite: 24]
}

// Lancement au chargement du document
$(document).ready(setupGlobalSimulation);
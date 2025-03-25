export let currentLanguageData = {}; // Ide töltjük be a fordításokat
document.addEventListener("DOMContentLoaded", () => {
    const langButton = document.getElementById("selected-lang");
    const dropdownItems = document.querySelectorAll(".dropdown-item");
    // LocalStorage-ból vesszük az alapértelmezett nyelvet, ha nincs, akkor "en"
    let savedLang = localStorage.getItem("lang") || "en";
    setLanguage(savedLang);
    dropdownItems.forEach((item) => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            const target = event.currentTarget;
            const lang = target.getAttribute("data-lang");
            if (lang) {
                setLanguage(lang);
            }
        });
    });
    function setLanguage(lang) {
        const shortNames = { "de": "DE", "en": "EN", "hu": "HU" };
        if (langButton) {
            langButton.textContent = shortNames[lang] || "EN"; // Ha ismeretlen nyelv, marad EN
        }
        localStorage.setItem("lang", lang); // Nyelv mentése LocalStorage-ba
        // Dropdown aktív elemének beállítása
        dropdownItems.forEach(item => {
            if (item.getAttribute("data-lang") === lang) {
                item.classList.add("active");
            }
            else {
                item.classList.remove("active");
            }
        });
        // Oldal szövegének frissítése
        loadLanguage(lang);
    }
    function loadLanguage(lang) {
        fetch(`lang/${lang}.json`)
            .then(response => response.json())
            .then(data => {
            // Az oldal címének frissítése az aktuális oldal alapján
            currentLanguageData = data;
            const pageId = document.body.getAttribute("data-page"); // pl. home, game, players stb.
            if (pageId && data.titles[pageId]) {
                document.title = data.titles[pageId];
            }
            // Menü elemek frissítése
            document.getElementById("nav-game").textContent = data.nav.game;
            document.getElementById("nav-players").textContent = data.nav.players;
            document.getElementById("nav-history").textContent = data.nav.history;
            document.getElementById("nav-rules").textContent = data.nav.rules;
            document.getElementById("nav-brand").textContent = data.nav.brand;
            document.getElementById("pointsModalLabel").textContent = data.modal.title;
            document.getElementById("playerPrompt").textContent = data.modal.playerPrompt;
            document.getElementById("savePoints").textContent = data.modal.saveButton;
            document.querySelector("footer").textContent = data.footer;
            document.getElementById("newRoundButton").textContent = data.buttons.newRound;
            document.getElementById("savePoints").textContent = data.buttons.savePoints;
            document.getElementById("gameTitle").textContent = data.messages.gameTitle;
            document.getElementById("gameDescription").textContent = data.messages.gameDescription;
            document.getElementById("enterPoints").textContent = data.modals.enterPoints;
        })
            .catch(error => console.error("Hiba a fordítás betöltésekor:", error));
    }
});
//

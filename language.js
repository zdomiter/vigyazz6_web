export let currentLanguageData = {}; // Ide töltjük be a fordításokat
document.addEventListener("DOMContentLoaded", () => {
    const langButton = document.getElementById("selected-lang");
    const dropdownItems = document.querySelectorAll(".dropdown-item");
    // Támogatott nyelvek listája
    const supportedLangs = ["en", "de", "hu"];
    // Böngésző nyelvének lekérése
    const browserLang = navigator.language.split("-")[0]; // Az elsődleges nyelvkódot vesszük (pl. "hu-HU" → "hu")
    // Ha támogatott nyelv, akkor azt használjuk, különben "en"
    const defaultLang = supportedLangs.includes(browserLang) ? browserLang : "en";
    // LocalStorage-ból vesszük a nyelvet, ha nincs, akkor a detektált alapértelmezettet használjuk
    const savedLang = localStorage.getItem("lang") || defaultLang;
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
            // 🔹 Közös menüelemek frissítése
            updateElementText("nav-game", data.nav.game);
            updateElementText("nav-players", data.nav.players);
            updateElementText("nav-history", data.nav.history);
            updateElementText("nav-rules", data.nav.rules);
            updateElementText("nav-brand", data.nav.brand);
            document.querySelector("footer").textContent = data.footer;
            if (pageId === "game") {
                updateElementText("gameTitle", data.messages.gameTitle);
                updateElementText("gameDescription", data.messages.gameDescription);
                updateElementText("goToPlayers", data.messages.goToPlayers);
                updateElementText("enterPoints", data.modals.enterPoints);
                updateElementText("pointsModalLabel", data.modal.title);
                updateElementText("newRoundButton", data.buttons.newRound);
                updateElementText("savePoints", data.buttons.savePoints);
            }
            else if (pageId === "players") {
                updateElementText("player-h2", data.messages.playersTitle);
                document.getElementById("new-player").setAttribute("placeholder", data.placeholders.newPlayer);
                updateElementText("storageInfoLabel", data.storageInfoModal.storageInfoLabel);
                //updateElementText("addPlayerButton", data.buttons.addPlayer);
            }
            else if (pageId === "history") {
                updateElementText("historyTitle", data.messages.historyTitle);
                updateElementText("clearHistoryButton", data.buttons.clearHistory);
            }
            else if (pageId === "rules") {
                updateElementText("rulesTitle", data.messages.rulesTitle);
                updateElementText("rulesContent", data.messages.rulesContent);
            }
        })
            .catch(error => console.error("Hiba a fordítás betöltésekor:", error));
    }
    /**
    * 🔹 Segédfüggvény az elem szövegének beállításához
    * - Csak akkor állítja be a szöveget, ha az elem létezik, így elkerülhetők a hibák.
    */
    function updateElementText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }
});
//

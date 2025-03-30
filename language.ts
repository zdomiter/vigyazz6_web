export let currentLanguageData: any = {}; // Ide töltjük be a fordításokat

document.addEventListener("DOMContentLoaded", () => {
    const langButton = document.getElementById("selected-lang") as HTMLElement;
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
            const target = event.currentTarget as HTMLElement;
            const lang = target.getAttribute("data-lang");

            if (lang) {
                setLanguage(lang);
            }
        });
    });

    function setLanguage(lang: string): void {
        const shortNames: { [key: string]: string } = { "de": "DE", "en": "EN", "hu": "HU" };

        if (langButton) {
            langButton.textContent = shortNames[lang] || "EN"; // Ha ismeretlen nyelv, marad EN
        }

        localStorage.setItem("lang", lang); // Nyelv mentése LocalStorage-ba

        // Dropdown aktív elemének beállítása
        dropdownItems.forEach(item => {
            if (item.getAttribute("data-lang") === lang) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        // Oldal szövegének frissítése
        loadLanguage(lang);
    }
    function loadLanguage(lang: string) {
        fetch(`lang/${lang}.json`)
            .then(response => response.json())
            .then(data => {
                // Az oldal címének frissítése az aktuális oldal alapján
                currentLanguageData = data
                document.dispatchEvent(new Event("languageLoaded"));
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
                document.querySelector("footer")!.textContent = data.footer;
                
                if (pageId === "game") {
                    updateElementText("gameTitle", data.messages.gameTitle);
                    updateElementText("gameDescription", data.messages.gameDescription);
                    updateElementText("goToPlayers", data.messages.goToPlayers);
                    updateElementText("enterPoints", data.modals.enterPoints);
                    updateElementText("pointsModalLabel", data.modal.title);
                    updateElementText("savePoints", data.buttons.savePoints);

                } else if (pageId === "players") {
                    updateElementText("player-h2", data.messages.playersTitle);
                    document.getElementById("new-player")!.setAttribute("placeholder", data.placeholders.newPlayer);             
                    updateElementText("storageInfoLabel", data.storageInfoModal.storageInfoLabel);
                    updateElementText("storageInfoBody", data.storageInfoModal.storageInfoBody, true);
                    updateElementText("inGamePlayerInfoLabel", data.inGamePlayerInfoModal.inGamePlayerInfoLabel);
                    updateElementText("inGamePlayerInfoBody", data.inGamePlayerInfoModal.inGamePlayerInfoBody);
                    updateElementText("start-game", data.buttons.startGame);
                } else if (pageId === "history") {
                } else if (pageId === "rules") {
                    loadRules(data);
                }

            })
            .catch(error => console.error("Hiba a fordítás betöltésekor:", error));
    }
    
    /**
    * 🔹 Segédfüggvény az elem szövegének beállításához
    * - Csak akkor állítja be a szöveget, ha az elem létezik, így elkerülhetők a hibák.
    */
    function updateElementText(elementId: string, text: string, allowHTML = false) {
        const element = document.getElementById(elementId);
        if (element) {
            if (allowHTML) {
                element.innerHTML = text; // Csak ha szükséges!
            } else {
                element.textContent = text;
            }
        }
    }
    function loadRules(data: any) {
        const container = document.getElementById("rules-container");
        if (!container) return;
    
        container.innerHTML = ""; // Töröljük a korábbi tartalmat
    
        // Cím megjelenítése
        const title = document.createElement("h1");
        title.classList.add("text-center", "mb-4");
        title.textContent = data.rules.title;
        container.appendChild(title);
    
        // Szabályok bejárása és megjelenítése
        data.rules.sections.forEach((section: any) => {
            const sectionTitle = document.createElement("h2");
            sectionTitle.classList.add("mb-3");
            sectionTitle.textContent = section.title;
            container.appendChild(sectionTitle);
    
            if (section.content) {
                const paragraph = document.createElement("p");
                paragraph.classList.add("mb-3");
                paragraph.textContent = section.content;
                container.appendChild(paragraph);
            }
    
            if (section.list) {
                const list = document.createElement("ul");
                list.classList.add("mb-3");
                section.list.forEach((item: string) => {
                    const listItem = document.createElement("li");
                    listItem.textContent = item;
                    list.appendChild(listItem);
                });
                container.appendChild(list);
            }
    
            if (section.info) {
                section.info.forEach((item: any) => {
                    const paragraph = document.createElement("p");
                    paragraph.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
                    container.appendChild(paragraph);
                });
            }
        });
    }
    
});

//
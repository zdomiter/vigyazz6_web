# Vigyáz(z) 6! – Pontszámoló

[English](README.md) | **Magyar**

Könnyű webalkalmazás a **Vigyázz 6!** kártyajáték pontjainak vezetéséhez. Körönként rögzíted, hány ökörfejet vitt el egy-egy játékos, az alkalmazás pedig kiszámolja az állást, felismeri a játék végét, kiemeli a győztest és elmenti az eredményt.

Nem kell telepíteni, nem kell regisztrálni, nincs szerver: a böngészőben fut, és minden adatot helyben, az eszközödön tárol.

<p align="center">
  <img src="screenshots/players.jpg" alt="Játékosok felvétele" width="250">
  &nbsp;
  <img src="screenshots/game-over.jpg" alt="Végeredmény a kiemelt győztessel" width="250">
  &nbsp;
  <img src="screenshots/history.jpg" alt="Korábbi játékok" width="250">
</p>

## Funkciók

- **Játékosok kezelése** – a játék előtt játékosokat vehetsz fel és törölhetsz (legalább 2 játékos kell).
- **Körönkénti pontrögzítés** – mindenki 66 ponttal indul; minden kör után megadod, hány ökörfejet gyűjtött az adott játékos (0–171), és ez levonódik a pontjaiból.
- **Élő sorrend** – minden kör után pontszám szerint rendeződnek a játékosok, azonos pontszámnál azonos helyezést kapnak, és a kártyájukon látszanak az eddigi körök pontjai is.
- **Automatikus játékvége** – a játék véget ér, amint valaki eléri a 0 pontot vagy az alá kerül; az élen álló játékos győztesként kiemelve jelenik meg.
- **Előzmények** – a befejezett játékok automatikusan mentődnek dátummal, időponttal, a győztessel és a teljes végeredménnyel.
- **Beépített játékszabály** – a szabályok az alkalmazáson belül is elérhetők.
- **Többnyelvű** – magyar, angol és német felület.
- **Mobilra optimalizált** – reszponzív felület, elsősorban telefonra tervezve, hogy játék közben ott lehessen az asztalon.

## Adatvédelem

Az alkalmazásnak nincs háttérszervere. A játékosok, a pontok és az előzmények kizárólag a böngésző `localStorage` tárolójában vannak; semmit nem küld szerverre és nem fogad onnan, személyes vagy érzékeny adatot nem kezel. A böngészőadatok törlésével a mentett játékok is törlődnek.

Külső kérés csak a statikus erőforrásokra megy (Bootstrap, Bootstrap Icons és a Rubik betűtípus nyilvános CDN-ről).

## Technológiák

- TypeScript (ES modulokra fordítva)
- HTML5, CSS3
- [Bootstrap 5.3](https://getbootstrap.com/) és [Bootstrap Icons](https://icons.getbootstrap.com/)
- Böngésző `localStorage` az adatok tárolására

Nincs keretrendszer és nincs bundler – csak statikus fájlok.

## Helyi futtatás

1. Klónozd a repót:
   ```bash
   git clone https://github.com/zdomiter/vigyazz6_web.git
   cd vigyazz6_web
   ```
2. Szolgáld ki a mappát bármilyen statikus webszerverrel, például:
   ```bash
   npx serve .
   ```
   vagy használd a VS Code *Live Server* bővítményét.
   Az `index.html` közvetlen megnyitása (`file://`) nem működik, mert a böngészők a helyi fájlrendszerből tiltják az ES modulok betöltését.
3. Ha módosítod a `.ts` fájlokat, fordítsd újra őket:
   ```bash
   npx tsc
   ```

## Projektstruktúra

| Fájl | Szerepe |
|------|---------|
| `index.html`, `game.ts` | Játék képernyő: körök, pontozás, sorrend, játékvége |
| `player.html`, `player.ts` | Játékosok felvétele és törlése |
| `history.html`, `history.ts` | Korábbi játékok mentett eredményei |
| `game_rules.html` | Játékszabály |
| `user.ts` | Játékos modell |
| `storage.ts` | `localStorage` olvasása és írása |
| `language.ts`, `lang/` | Fordítások és nyelvváltás |
| `style.css` | Egyedi stílusok és animációk |

## Megjegyzés

Ez egy nem hivatalos, rajongói segédalkalmazás. A Vigyázz 6! (*6 nimmt!*) Wolfgang Kramer kártyajátéka, kiadója az AMIGO; a kapcsolódó védjegyek a jogtulajdonosokat illetik.

## Szerző

© 2025 Domiter Zoltán – Minden jog fenntartva.

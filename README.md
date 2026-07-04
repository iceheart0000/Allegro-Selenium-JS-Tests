# Allegro Selenium JS Tests

## Opis projektu

Projekt zawiera test automatyczny aplikacji webowej Allegro napisany w **JavaScript** z użyciem **Selenium**.

Test realizuje scenariusz:
1. Wejście na stronę główną Allegro.
2. Obsługa popupu cookies, jeśli się pojawi.
3. Obsługa ręcznej weryfikacji człowieka, jeśli Allegro ją wyświetli.
4. Wyszukanie produktu, np. `komputer`.
5. Przescrollowanie listy wyników na dół.
6. Przejście na kolejną podstronę wyników.
7. Wybranie produktu z listy według konfigurowalnego indeksu, np. drugi produkt od góry.
8. Dodanie produktu do koszyka.
9. Przejście do koszyka.
10. Weryfikacja, czy wybrany produkt znajduje się w koszyku.


## Struktura projektu

```text
allegro-selenium-js-tests/
├── package.json
├── test.js
├── config.js
├── logger.js
└── pages/
    ├── BasePage.js
    ├── HomePage.js
    ├── SearchResultsPage.js
    ├── ProductPage.js
    └── CartPage.js
```

## Wymagania

Przed uruchomieniem projektu należy mieć zainstalowane:

- **Node.js**
- **npm**
- **Google Chrome**

## Uruchomienie testu

Aby uruchomić test, należy wykonać komende:

'''bash
node test.js





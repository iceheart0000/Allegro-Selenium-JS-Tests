const { By, Key } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const Logger = require('../logger');

class HomePage extends BasePage {
  constructor(driver) {
    super(driver);

    this.searchInput = By.css('input[data-role="search-input"], input[name="string"]');

    this.cookieButton = By.xpath(
      "//button[contains(., 'Akceptuję') or contains(., 'Zgadzam') or contains(., 'Przejdź dalej') or contains(., 'Ok, zgadzam się')]"
    );
  }

  async openHomePage(baseUrl) {
    Logger.step('Otwieram stronę główną Allegro');
    await this.open(baseUrl);
  }

  async acceptCookiesIfVisible() {
    Logger.step('Sprawdzam popup cookies');

    const clicked = await this.clickIfExists(this.cookieButton, 7000);

    if (clicked) {
      Logger.info('Popup cookies zaakceptowany');
    } else {
      Logger.info('Popup cookies nie pojawił się');
    }
  }

  async verifySearchInputIsVisible() {
    Logger.step('Sprawdzam, czy wyszukiwarka jest widoczna');

    const exists = await this.elementExists(this.searchInput, 10000);

    if (!exists) {
      throw new Error('Pole wyszukiwania nie jest widoczne');
    }

    Logger.success('Pole wyszukiwania jest widoczne');
  }

  async searchProduct(productName) {
    Logger.step(`Wyszukuję produkt: ${productName}`);

    const input = await this.waitForVisible(this.searchInput);
    await input.clear();
    await input.sendKeys(productName);
    await input.sendKeys(Key.ENTER);

    Logger.success(`Wysłano wyszukiwanie produktu: ${productName}`);
  }


  async waitIfHumanVerificationAppears() {
  Logger.step('Sprawdzam, czy pojawiła się weryfikacja człowieka');

  const verificationText = await this.driver
    .findElements(By.xpath("//*[contains(text(), 'Potwierdź, że jesteś człowiekiem')]"));

  if (verificationText.length > 0) {
    Logger.info('Wykryto ekran weryfikacji człowieka');
    Logger.info('Kliknij ręcznie przycisk POTWIERDZAM w otwartej przeglądarce');
    Logger.info('Test poczeka 60 sekund');

    await this.driver.sleep(60000);

    Logger.info('Kontynuuję test po oczekiwaniu');
  } else {
    Logger.info('Ekran weryfikacji człowieka nie pojawił się');
  }
}




}

module.exports = HomePage;
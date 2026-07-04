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

  async waitIfHumanVerificationAppears(waitMs = 5000) {
    Logger.step('Sprawdzam, czy pojawiła się weryfikacja człowieka');

    const verificationSelectors = [
      By.xpath("//*[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'potwierdź, że jesteś człowiekiem') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'czy jesteś człowiekiem') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'jesteś człowiekiem')]") ,
      By.xpath("//*[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'human verification') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'verify you are human') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'captcha')]") ,
      By.css('iframe[src*="recaptcha"], iframe[src*="captcha"]')
    ];

    let found = false;

    for (const locator of verificationSelectors) {
      try {
        const elements = await this.driver.findElements(locator);
        if (elements.length > 0) {
          found = true;
          break;
        }
      } catch {
        // ignore transient lookup failures
      }
    }

    if (!found) {
      Logger.info('Ekran weryfikacji człowieka nie pojawił się');
      return;
    }

    Logger.info('Wykryto weryfikację człowieka – czekam krótko i kontynuuję');
    await this.driver.sleep(waitMs);
  }
}

module.exports = HomePage;

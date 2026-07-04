const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const Logger = require('../logger');

class ProductPage extends BasePage {
  constructor(driver) {
    super(driver);

    this.productTitle = By.css('h1');

    this.addToCartButton = By.xpath(
      "//button[contains(., 'Dodaj do koszyka') or contains(., 'do koszyka')]"
    );

    this.goToCartButton = By.xpath(
      "//a[contains(., 'Przejdź do koszyka') or contains(., 'koszyka') or contains(@href, 'koszyk')]"
    );

    this.cartIcon = By.css('a[href*="koszyk"], a[href*="cart"]');
  }

  async waitForProductPage() {
    Logger.step('Czekam na stronę produktu');
    await this.waitForVisible(this.productTitle);
    Logger.success('Strona produktu została załadowana');
  }

  async getProductTitle() {
    Logger.step('Pobieram tytuł produktu');

    const title = await this.getText(this.productTitle);

    if (!title || title.trim().length === 0) {
      throw new Error('Tytuł produktu jest pusty');
    }

    Logger.success(`Tytuł produktu: ${title}`);

    return title;
  }

  async addProductToCart() {
    Logger.step('Dodaję produkt do koszyka');

    await this.click(this.addToCartButton);

    Logger.success('Kliknięto przycisk dodania do koszyka');
  }

  async goToCart() {
    Logger.step('Przechodzę do koszyka');

    const clickedModalButton = await this.clickIfExists(this.goToCartButton, 10000);

    if (clickedModalButton) {
      Logger.success('Kliknięto przycisk przejścia do koszyka');
      return;
    }

    Logger.info('Nie znaleziono przycisku w modalu, próbuję kliknąć ikonę koszyka');

    await this.click(this.cartIcon);

    Logger.success('Przejście do koszyka przez ikonę');
  }
}

module.exports = ProductPage;
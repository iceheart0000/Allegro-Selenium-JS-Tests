const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const Logger = require('../logger');

class CartPage extends BasePage {
  constructor(driver) {
    super(driver);

    this.cartContainer = By.css('main');
    this.pageBody = By.css('body');
  }

  async waitForCartPage() {
    Logger.step('Czekam na stronę koszyka');

    await this.waitForVisible(this.cartContainer);

    Logger.success('Strona koszyka jest widoczna');
  }

  async verifyProductInCart(productTitle) {
    Logger.step('Weryfikuję, czy produkt znajduje się w koszyku');

    await this.waitForCartPage();

    const body = await this.waitForVisible(this.pageBody);
    const cartText = await body.getText();
    const normalizedCartText = this.normalizeText(cartText);
    const normalizedProductTitle = this.normalizeText(productTitle);
    const titleWords = normalizedProductTitle.split(/\s+/).filter(Boolean);

    const hasAllTitleWords = titleWords.every((word) => normalizedCartText.includes(word));

    if (!hasAllTitleWords && !normalizedCartText.includes(normalizedProductTitle)) {
      Logger.error('Produkt nie został znaleziony w koszyku');
      Logger.info(`Szukany produkt: ${productTitle}`);
      Logger.info(`Tekst strony koszyka: ${cartText.slice(0, 1000)}`);

      throw new Error(`Koszyk nie zawiera produktu: ${productTitle}`);
    }

    Logger.success(`Produkt znajduje się w koszyku: ${productTitle}`);
  }

  normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }
}

module.exports = CartPage;
const { By, until } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const Logger = require('../logger');

class SearchResultsPage extends BasePage {
  constructor(driver) {
    super(driver);

    this.productLinks = By.css('article a[href*="/oferta/"]');

    this.nextPageButton = By.xpath(
      "//a[contains(@rel, 'next') or contains(., 'następna') or contains(., 'Następna')]"
    );
  }

  async waitForResults() {
    Logger.step('Czekam na wyniki wyszukiwania');

    await this.driver.wait(async () => {
      const products = await this.findElements(this.productLinks);
      return products.length > 0;
    }, this.timeout);

    Logger.success('Wyniki wyszukiwania są widoczne');
  }

  async verifyResultsExist() {
    Logger.step('Sprawdzam, czy lista wyników nie jest pusta');

    const products = await this.findElements(this.productLinks);

    if (products.length === 0) {
      throw new Error('Nie znaleziono żadnych produktów na liście');
    }

    Logger.success(`Liczba znalezionych linków produktów: ${products.length}`);
  }

  async scrollToEndOfList() {
    Logger.step('Scrolluję na dół listy wyników');
    await this.scrollToBottom();
    Logger.success('Przescrollowano na dół listy');
  }

  async goToNextResultsPage() {
    Logger.step('Przechodzę na kolejną podstronę wyników');

    const oldUrl = await this.getCurrentUrl();

    const nextButton = await this.waitForClickable(this.nextPageButton);

    await this.scrollToElement(nextButton);
    await nextButton.click();

    await this.driver.wait(async () => {
      const newUrl = await this.getCurrentUrl();
      return newUrl !== oldUrl;
    }, this.timeout);

    Logger.success('Przejście na kolejną podstronę zakończone sukcesem');
  }

  async chooseProductByIndex(productIndex) {
    Logger.step(`Wybieram produkt numer ${productIndex} od góry listy`);

    if (productIndex < 1) {
      throw new Error('productIndex musi być większy lub równy 1');
    }

    await this.waitForResults();

    const products = await this.findElements(this.productLinks);

    if (products.length < productIndex) {
      throw new Error(
        `Nie można wybrać produktu numer ${productIndex}, bo znaleziono tylko ${products.length} produktów`
      );
    }

    const selectedProduct = products[productIndex - 1];

    await this.scrollToElement(selectedProduct);

    const productNameFromList = await selectedProduct.getText();
    const productUrl = await selectedProduct.getAttribute('href');

    Logger.info(`Wybrany produkt z listy: ${productNameFromList}`);
    Logger.info(`URL produktu: ${productUrl}`);

    await this.driver.wait(
      until.elementIsVisible(selectedProduct),
      this.timeout
    );

    await selectedProduct.click();

    Logger.success('Kliknięto wybrany produkt');

    return {
      name: productNameFromList,
      url: productUrl
    };
  }
}

module.exports = SearchResultsPage;
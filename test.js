const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const config = require('./config');
const Logger = require('./logger');

const HomePage = require('./pages/HomePage');
const SearchResultsPage = require('./pages/SearchResultsPage');
const ProductPage = require('./pages/ProductPage');
const CartPage = require('./pages/CartPage');

async function runTest() {
  Logger.step('Start testu Allegro');

  const chromeOptions = new chrome.Options();

  chromeOptions.addArguments('--window-size=1920,1080');
  chromeOptions.addArguments('--disable-notifications');
  chromeOptions.addArguments('--disable-popup-blocking');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();

  try {
    const homePage = new HomePage(driver);
    const searchResultsPage = new SearchResultsPage(driver);
    const productPage = new ProductPage(driver);
    const cartPage = new CartPage(driver);

    await homePage.openHomePage(config.baseUrl);

    await homePage.waitIfHumanVerificationAppears();

    await homePage.acceptCookiesIfVisible();

    await homePage.verifySearchInputIsVisible();

    await homePage.searchProduct(config.searchPhrase);

    await searchResultsPage.waitForResults();

    await searchResultsPage.verifyResultsExist();

    await searchResultsPage.scrollToEndOfList();

    await searchResultsPage.goToNextResultsPage();

    await searchResultsPage.waitForResults();

    const selectedProduct = await searchResultsPage.chooseProductByIndex(
      config.productIndex
    );

    Logger.info(`Produkt wybrany z listy: ${selectedProduct.name}`);

    await productPage.waitForProductPage();

    const productTitle = await productPage.getProductTitle();

    await productPage.addProductToCart();

    await productPage.goToCart();

    await cartPage.verifyProductInCart(productTitle);

    Logger.success('TEST ZAKOŃCZONY SUKCESEM');
  } catch (error) {
    Logger.error('TEST ZAKOŃCZONY BŁĘDEM');
    Logger.error(error.message);

    throw error;
  } finally {
    Logger.step('Zamykam przeglądarkę');
    await driver.quit();
  }
}

runTest().catch(() => {
  process.exit(1);
});
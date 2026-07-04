const { By, until } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const Logger = require('../logger');

class ProductPage extends BasePage {
  constructor(driver) {
    super(driver);

    this.productTitle = By.css('h1');

    this.addToCartButton = By.xpath(
      "//button[contains(., 'Dodaj do koszyka') or contains(., 'Do koszyka')]"
    );

    this.addedToCartText = By.xpath(
      "//*[contains(., 'Dodano do koszyka') or contains(., 'Produkt dodany do koszyka') or contains(., 'dodano do koszyka')]"
    );

    this.goToCartButton = By.xpath(
      "//a[contains(., 'Przejdź do koszyka') or contains(., 'Zobacz koszyk') or contains(@href, 'koszyk')]"
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





    async findAddToCartButton() {
    const candidates = [
      By.css('button[data-testid="add-to-cart-button"]'),
      By.css('button[data-testid="add-to-basket"]'),
      By.css('button'),
      By.css('a')
    ];

    for (const locator of candidates) {
      const elements = await this.driver.findElements(locator);

      for (const element of elements) {
        try {
          if (!(await element.isDisplayed())) {
            continue;
          }
        } catch {
          continue;
        }

        const text = (await element.getText()).toLowerCase();
        const ariaLabel = ((await element.getAttribute('aria-label')) || '').toLowerCase();
        const title = ((await element.getAttribute('title')) || '').toLowerCase();
        const combinedText = `${text} ${ariaLabel} ${title}`;

        if (
          combinedText.includes('dodaj do koszyka') ||
          combinedText.includes('do koszyka') ||
          combinedText.includes('add to cart')
        ) {
          return element;
        }
      }
    }

    return null;
  }

  async addProductToCart() {
    Logger.step('Dodaję produkt do koszyka');

    const addButton = await this.findAddToCartButton();

    if (!addButton) {
      throw new Error('Nie znaleziono widocznego przycisku "Dodaj do koszyka"');
    }

    await this.driver.executeScript(
      'arguments[0].scrollIntoView({block: "center"});',
      addButton
    );

    await this.driver.wait(async () => {
      try {
        return await addButton.isDisplayed() && await addButton.isEnabled();
      } catch {
        return false;
      }
    }, this.timeout);

    Logger.info('Klikam przycisk Dodaj do koszyka');
    await this.driver.executeScript('arguments[0].click();', addButton);

    Logger.info('Kliknięto przycisk Dodaj do koszyka');

    const success = await this.driver.wait(async () => {
      const pageText = await this.getPageText();
      return (
        pageText.includes('Dodano do koszyka') ||
        pageText.includes('Przejdź do koszyka') ||
        pageText.includes('Zobacz koszyk') ||
        pageText.includes('koszyku') ||
        pageText.includes('Twoje produkty') ||
        pageText.includes('W koszyku')
      );
    }, 8000).catch(() => false);

    if (!success) {
      Logger.info('Nie wykryto od razu komunikatu o dodaniu do koszyka, ale próbuję przejść dalej');
      return;
    }

    Logger.success('Na stronie wykryto informację sugerującą dodanie produktu do koszyka');
  }

  async goToCart() {
    Logger.step('Przechodzę do koszyka');

    const clickedModalButton = await this.clickIfExists(this.goToCartButton, 10000);

    if (clickedModalButton) {
      Logger.success('Kliknięto przycisk przejścia do koszyka');
      return;
    }

    const cartLink = await this.findCartNavigationLink();

    if (cartLink) {
      await this.driver.executeScript(
        'arguments[0].scrollIntoView({block: "center"});',
        cartLink
      );
      await cartLink.click();
      Logger.success('Przejście do koszyka przez link koszyka');
      return;
    }

    Logger.info('Nie znaleziono linku koszyka, próbuję otworzyć stronę koszyka bezpośrednio');
    await this.open('https://allegro.pl/koszyk');
    Logger.success('Otwarto stronę koszyka bezpośrednio');
  }

  async findCartNavigationLink() {
    const candidates = [
      By.xpath("//a[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'przejdź do koszyka') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'zobacz koszyk') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'koszyk')]"),
      this.cartIcon
    ];

    for (const locator of candidates) {
      const elements = await this.driver.findElements(locator);

      for (const element of elements) {
        try {
          if (!(await element.isDisplayed())) {
            continue;
          }
        } catch {
          continue;
        }

        return element;
      }
    }

    return null;
  }
}

module.exports = ProductPage;
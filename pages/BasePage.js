const { until } = require('selenium-webdriver');

class BasePage {
  constructor(driver, timeout = 20000) {
    this.driver = driver;
    this.timeout = timeout;
  }

  async open(url) {
    await this.driver.get(url);
  }

  async waitForElement(locator) {
    return await this.driver.wait(
      until.elementLocated(locator),
      this.timeout
    );
  }

  async waitForVisible(locator) {
    const element = await this.waitForElement(locator);

    await this.driver.wait(
      until.elementIsVisible(element),
      this.timeout
    );

    return element;
  }

  async waitForClickable(locator) {
    const element = await this.waitForVisible(locator);

    await this.driver.wait(
      until.elementIsEnabled(element),
      this.timeout
    );

    return element;
  }

  async click(locator) {
    const element = await this.waitForClickable(locator);

    await this.driver.executeScript(
      'arguments[0].scrollIntoView({block: "center"});',
      element
    );

    await this.driver.sleep(300);
    await element.click();
  }

  async type(locator, text) {
    const element = await this.waitForVisible(locator);
    await element.clear();
    await element.sendKeys(text);
  }

  async getText(locator) {
    const element = await this.waitForVisible(locator);
    return await element.getText();
  }

  async findElements(locator) {
    return await this.driver.findElements(locator);
  }

  async scrollToBottom() {
    await this.driver.executeScript(
      'window.scrollTo(0, document.body.scrollHeight);'
    );

    await this.driver.sleep(1500);
  }

  async scrollToElement(element) {
    await this.driver.executeScript(
      'arguments[0].scrollIntoView({block: "center"});',
      element
    );

    await this.driver.sleep(500);
  }

  async elementExists(locator, timeout = 5000) {
    try {
      await this.driver.wait(
        until.elementLocated(locator),
        timeout
      );

      return true;
    } catch {
      return false;
    }
  }

  async clickIfExists(locator, timeout = 5000) {
    try {
      const exists = await this.elementExists(locator, timeout);

      if (!exists) {
        return false;
      }

      const element = await this.driver.wait(
        until.elementLocated(locator),
        timeout
      );

      await this.driver.wait(
        until.elementIsVisible(element),
        timeout
      );

      await this.driver.executeScript(
        'arguments[0].scrollIntoView({block: "center"});',
        element
      );

      await element.click();
      return true;
    } catch {
      return false;
    }
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  async getPageText() {
    const body = await this.waitForVisible(require('selenium-webdriver').By.css('body'));
    return await body.getText();
  }
}




module.exports = BasePage;
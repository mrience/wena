import webdriver, { WebDriver } from "selenium-webdriver"

let driver: WebDriver;

const init = async () => {
    driver = await new webdriver.Builder().forBrowser('chrome').build();
}

export { init, driver }

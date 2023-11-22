import webdriver, { WebDriver } from "selenium-webdriver"
import { Options } from "selenium-webdriver/chrome";

let driver: WebDriver;

const init = async () => {
    const options = new Options()
    .addArguments('disable-dev-shm-usage', 'no-sandbox')
    .setChromeBinaryPath('/opt/hostedtoolcache/chromium/latest/x64');
    driver = await new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build();
}

export { init, driver }

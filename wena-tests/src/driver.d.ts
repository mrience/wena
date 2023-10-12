import { WebDriver } from "selenium-webdriver";
declare let driver: WebDriver;
declare const init: () => Promise<void>;
export { init, driver };

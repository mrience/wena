import { By } from "selenium-webdriver";
import { driver } from "../driver";


const type = async(selector: string, text: string) => {
    const element = driver.findElement(By.css(selector));
    await element.clear();
    await element.sendKeys(text);
}

const click = async (selector: string) => {
    await driver.findElement(By.css(selector)).click();
}


const getText = async (selector: string) => {
    return driver.findElement(By.css(selector)).getText();
}

export {type, click, getText}
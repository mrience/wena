// import webdriver from "selenium-webdriver";
import { Given, Then, When } from "../pages/members-page";
import data from '../data/members.json';
import { init, driver } from "../driver";

describe('members', () => {
    
    beforeEach(async () => {
        await init();
    });

    it.each(data)('should show error message', async ({email, password, message}) => {
        await Given.membersPageIsLoaded();
        await When.userLoggesInWithEmailAndPassword(email, password);
        await Then.expectsErrorMessage(message);
    });

    afterEach(async () => {
        await driver.close();
    });
});
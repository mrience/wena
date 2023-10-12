import { type, click, getText} from "../utils/actions";
import { endpoints, getUrl } from "../utils/urls";
import { driver } from "../driver";

const SELECTORS = {
    'loginEmailInput': '[id="email_address"]',
    'loginPasswordInput': '[id="password"]',
    'loginSubmitButton': '[name="login"]',
    'loginError': '[class="errorbox"]',
}


const Given = {
    membersPageIsLoaded: async () => {
        await driver.get(getUrl(endpoints.members));
    }
}

const When = {
    userLoggesInWithEmailAndPassword: async (email: string, password: string) => {
        await type(SELECTORS.loginEmailInput, email);
        await type(SELECTORS.loginPasswordInput, password);
        await click(SELECTORS.loginSubmitButton);
    }
}

const Then = {
     expectsErrorMessage: async (message: string) => {
        expect(await getText(SELECTORS.loginError)).toBe(message);
    }
}

export { Given, When, Then }
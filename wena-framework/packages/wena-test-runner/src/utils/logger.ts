import pc from 'picocolors';


export default class Logger {

    static success(message: string) {
        console.log(pc.green(`${message}`));
    }

    static info(message: string) {
        console.info(message);
    }

    static warning(message: string) {
        console.warn(message);
    }

    static error(message: string) {
        console.log(pc.red(`${message}`));
    }
}
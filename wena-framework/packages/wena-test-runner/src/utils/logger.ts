import pc from "picocolors";

export default class Logger {
  static success(message: string) {
    console.log(pc.green(`${message}`));
  }

  static info(message: string) {
    console.info(pc.blue(`${message}`));
  }

  static warning(message: string) {
    console.warn(pc.yellow(`${message}`));
  }

  static error(message: string) {
    console.log(pc.red(`${message}`));
  }
}

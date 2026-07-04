class Logger {
  static step(message) {
    console.log(`\n[STEP] ${message}`);
  }

  static info(message) {
    console.log(`[INFO] ${message}`);
  }

  static success(message) {
    console.log(`[SUCCESS] ${message}`);
  }

  static error(message) {
    console.error(`[ERROR] ${message}`);
  }
}

module.exports = Logger;
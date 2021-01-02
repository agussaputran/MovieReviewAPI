class CustomError extends Error {
  constructor(code, name, message, detail) {
    super();
    this.code = code;
    this.name = name;
    this.message = message;
    this.detail = detail;
  }
}
module.exports = CustomError;

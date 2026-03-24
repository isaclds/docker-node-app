class AppError extends Error {
  constructor(title, status, message) {
    super(message);
    this.title = title;
    this.status = status;
    this.name = this.constructor.name;
  }
}

export default AppError;

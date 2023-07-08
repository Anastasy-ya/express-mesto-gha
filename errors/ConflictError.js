class ConflictError extends Error { // 409
  constructor(message) {
    super(message);
    this.name = 'Attempt to create an existing object';
    // попытка создать существующий объект
    this.statusCode = 409;
  }
}

module.exports = ConflictError;

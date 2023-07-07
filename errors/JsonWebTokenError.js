class JsonWebToken extends Error { // 401
  constructor(message) {
    super(message);
    this.name = 'JsonWebToken';
    this.statusCode = 401;
  }
}

module.exports = JsonWebToken;

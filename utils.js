function unauthorized(res) {
    res.status(401).send();
  }

  module.exports = { unauthorized };

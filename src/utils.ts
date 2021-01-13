function unauthorized(req: Request) {
  res.status(401).send();
}

module.exports = { unauthorized };

export default (req, res, next) => {
  if (req.user && req.user.isBanned) {
    return res.status(401).send({ message: "Your account has been banned." })
  } else {
    return next()
  }
}

export default (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next()
  } else {
    return res.status(403).send({ message: "You are not allowed to do that" })
  }
}

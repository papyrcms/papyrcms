export default (req, res, next) => {
  if (res.locals.settings.enableEmailingToUsers || (req.user && req.user.isAdmin)) {
    return next()
  } else {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }
}

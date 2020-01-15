export default async (req, res, next) => {
  if (!res.locals.settings) {
    res.locals.settings = {}
  }

  return next()
}

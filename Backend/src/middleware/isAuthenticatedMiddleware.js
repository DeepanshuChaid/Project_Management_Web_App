const isAuthenticatedMiddleware = (req, res, next) => {
  if (!req.user || !req.user.id) {
    throw new Error("Unauthorized. Please login to continue")
  }
  next()
}

export default isAuthenticatedMiddleware
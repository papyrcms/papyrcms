export default (req, res) => {
  req.logout()
  return res.send('logged out')
}
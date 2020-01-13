import keys from "../../../config/keys"

export default (req, res) => {
  if (req.method !== "POST") {
    return res.status(404).send({ message: "Endpoint not found." })
  }

  return res.send(keys.stripePublishableTestKey)
}

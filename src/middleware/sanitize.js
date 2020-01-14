import sanitizeHTML from "sanitize-html"


export default (req, res, next) => {
  const sanitizeRules = {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "div",
      "p",
      "pre",
      "em",
      "strong",
      "ol",
      "ul",
      "li",
      "a",
      "blockquote",
      "hr",
      "button",
      "table",
      "thead",
      "tbody",
      "th",
      "tr",
      "td",
      "img"
    ],
    allowedAttributes: {
      "*": ["style", "class"],
      a: ["style", "href", "target", "title"],
      table: ["style", "align"],
      img: ["style", "alt", "src"]
    }
  }

  // Santize inputs
  Object.keys(req.body).forEach(key => {
    req.body[key] = sanitizeHTML(req.body[key], sanitizeRules)
  })

  return next()
}

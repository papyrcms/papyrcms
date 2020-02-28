import sanitizeHTML from "sanitize-html"
import _ from 'lodash'


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
  _.forEach(req.body, (value, key) => {
    req.body[key] = sanitizeHTML(req.body[key], sanitizeRules)
  })

  return next()
}

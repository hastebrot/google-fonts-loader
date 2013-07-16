/// <reference path="./definitions/node.d.ts" />

var fs = require("fs")

import _cssLoader = require("./css_loader")
import _cssParser = require("./css_parser")
import _fontLoader = require("./font_loader")

var io2012slidesUrl = "http://fonts.googleapis.com/css?family=" +
  "Source+Code+Pro|Open+Sans:regular,semibold,italic,italicsemibold"

var cssLoader = new _cssLoader.CssLoader()
var cssParser = new _cssParser.CssParser()
var fontLoader = new _fontLoader.FontLoader()

var rootDir = "./tmp/io2012slides"
if (!fs.existsSync(rootDir)) {
  fs.mkdirSync(rootDir)
}

cssLoader.download(io2012slidesUrl, (format: string, content: string) => {
  var fontDefinitions = cssParser.parse(content)
  fontDefinitions.forEach((fontDefinition: _cssParser.FontDefinition) => {
    fontLoader.downloadFonts(rootDir, fontDefinition)
  })
})

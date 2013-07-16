/// <reference path="./definitions/node.d.ts" />

var _ = require("lodash")
var fs = require("fs")
var http = require("http")
var path = require("path")

import cssParser = require("./css_parser")

function downloadFont(fontDefinition: cssParser.CssFontDefinition) {
  var fontName = fontDefinition.locals[0]
  var url = fontDefinition.urls[0]

  var rootDir = "./tmp/css_fonts"
  if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir)
  }

  var fileName = fontName + path.extname(url)
  var filePath = rootDir + "/" + fileName

  if (!fs.existsSync(filePath)) {
    console.log(filePath)
    var file = fs.createWriteStream(filePath)
    http.get(url, function(res) {
      res.pipe(file)
    })
  }
}

function main() {
  var cssFile = "./tmp/css_examples/fonts-multi-ttf.css"
  var cssText = fs.readFileSync(cssFile).toString()

  var fontParser = new cssParser.CssFontParser()
  var fontDefinitions = fontParser.parse(cssText)
  _.forEach(fontDefinitions, (fontDefinition: cssParser.CssFontDefinition) => {
    downloadFont(fontDefinition)
  })
}

if (require.main === module) {
  main()
}

/**
 * Requirements
 */
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

/**
 * The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
 * @param {*} key
 * @param {*} value
 */
const replaces = (key, value) => {
  if (value instanceof Error) {
    return Object.getOwnPropertyNames(value).reduce(function (error, key) {
      error[key] = value[key];
      return error;
    }, {});
  }
  return value;
};

/**
 * Error handler
 * @param {*} error
 */
const handler = (error) => {
  console.log(JSON.stringify({ error: error }, replaces));

  if (error.properties && error.properties.errors instanceof Array) {
    const errorMessages = error.properties.errors
      .map(function (error) {
        return error.properties.explanation;
      })
      .join("\n");

    console.log("errorMessages", errorMessages);
  }
  throw error;
};

/**
 * Run template conversion
 * @param {*} labels
 * @param {*} source
 * @param {*} output
 */
const templater = (
  labels = {},
  source = "source.docx",
  output = "output.docx"
) => {
  // Load the docx file as a binary
  var content = fs.readFileSync(path.resolve(source), "binary");

  // Zip content of document
  var zip = new PizZip(content);
  var doc;
  try {
    doc = new Docxtemplater(zip);
  } catch (error) {
    // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
    handler(error);
  }

  // Set variables
  console.log(typeof labels)
  doc.setData(JSON.parse(labels));

  try {
    doc.render();
  } catch (error) {
    handler(error);
  }

  var buffered = doc.getZip().generate({ type: "nodebuffer" });

  // buffered is a nodejs buffer, you can either write it to a file or do anything else with it.
  return fs.writeFileSync(path.resolve(output), buffered);
};

/**
 *
 */
module.exports = { templater };

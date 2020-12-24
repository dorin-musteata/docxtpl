#!/usr/bin/env node

'use strict';

/**
 * System requirements
 */
const fs = require('fs');
const path = require('path');

/**
 * Initialize requirements
 */
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const yargs = require('yargs');

/**
 * Initialize options
 */
const options = yargs
  .usage('Usage: -t <template> -i <input> -o <output>')
  .option('t', {
    alias: 'template',
    describe: 'Template variables [.json]',
    type: 'string',
    demandOption: true,
  })
  .option('i', {
    alias: 'input',
    describe: 'Template source [.docx]',
    type: 'string',
    demandOption: false,
    default: 'source.docx',
  })
  .option('o', {
    alias: 'output',
    describe: 'Tempalte output [.docx]',
    type: 'string',
    default: 'output.docx',
    demandOption: false,
  }).argv;

/**
 * Initialize template parser
 */

/**
 * Handle object with all suberrors
 * @param {*} key
 * @param {*} value
 */
const _errors = (key, value) => {
  if (value instanceof Error) {
    return Object.getOwnPropertyNames(value).reduce(function (error, key) {
      error[key] = value[key];
      return error;
    }, {});
  }

  return value;
};

/**
 * Handle errors objects
 * @param {*} error
 */
const _handler = (error) => {
  console.log(JSON.stringify({ error: error }, _errors));

  if (error.properties && error.properties.errors instanceof Array) {
    const errors = error.properties.errors
      .map(function (error) {
        return error.properties.explanation;
      })
      .join('\n');

    console.log('errors', errors);
  }

  throw error;
};

// ==========================================================================================================================================

/**
 * Run template conversion options
 * @param {*} labels
 * @param {*} source
 * @param {*} output
 */
const exporter = (
  template = 'template.json',
  input = 'source.docx',
  output = 'output.docx'
) => {
  /**
   * Read .json
   */
  var variables = fs.readFileSync(path.resolve(template));
  variables = JSON.parse(variables);

  /**
   * Read .docx as binary
   */
  const content = fs.readFileSync(path.resolve(input), 'binary');

  /**
   * Zipping contents of document
   */
  const zip = new PizZip(content);
  var document;

  /**
   * Try to use zipped document
   */
  try {
    document = new Docxtemplater(zip);
  } catch (error) {
    /**
     * Catch compilation errors of template tags
     */
    _handler(error);
  }

  /**
   * Set template variables
   */
  document.setData(variables);

  /**
   * Try to render document and replace template variables
   */
  try {
    document.render();
  } catch (error) {
    _handler(error);
  }

  /**
   * Create node buffer of zipped document
   */
  const buffered = document.getZip().generate({ type: 'nodebuffer' });

  /**
   * Write buffer as file
   */
  return fs.writeFileSync(path.resolve(output), buffered);
};

/**
 * Execute exporter
 */
exporter(options.template, options.input, options.output);

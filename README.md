# docxtpl 


**docxtpl** is a simple cli tool to generate docx from a docx template by replacing `{placeholders}` with data provided from a json file. It uses 
[docxtemplater](https://github.com/open-xml-templating/docxtemplater) and [pizzip](https://github.com/open-xml-templating/pizzip) under the hood.

## Installation

Install with npm:

```sh
npm install -g docxtpl
```

Install with yarn:

```sh
yarn global add docxtpl
```


## Usage

```sh
Usage: -t <template> -i <input> -o <output>

Options:
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -t, --template  Template variables [.json]                 [string] [required]
  -i, --input     Template source [.docx]      [string] [default: "source.docx"]
  -o, --output    Tempalte output [.docx]      [string] [default: "output.docx"]
```

### Example
```sh
docxtpl -t template.json -i template.docx -o final.docx
```

*Will take **template.json** as variables list and will replace all placeholders in **template.docx** resulting in a output **final.docx** with replaced variables*

###### More exmaples complies with [docxtemplater](https://github.com/open-xml-templating/docxtemplater)

- [loops](https://docxtemplater.com/demo/#loops)
- [placeholders](https://docxtemplater.com/demo/#simple)
- [other](https://docxtemplater.com/demo/)


## Similar tools

There are a few libraries that work the same way:

- [docxtpl](https://www.docx4java.org/trac/docx4j) : Python. Uses jinja2  template syntax , doesn't provide an easy way to use landscape documents.

## Contributing

Functionality can be added via submitting pull requests

## Dependencies

- [docxtemplater](https://github.com/open-xml-templating/docxtemplater)
- [pizzip](https://github.com/open-xml-templating/pizzip) 
- [yargs](https://www.npmjs.com/package/yargs)

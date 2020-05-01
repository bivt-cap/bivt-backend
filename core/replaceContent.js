// Node.js Module
const fs = require('fs');

// Load a file and replace its content
const replaceContent = (file, options) => {
  // Load file content
  let fileContent = fs.readFileSync(file).toString();

  // Replace the content
  if (fileContent != null && fileContent !== '' && options != null) {
    Object.keys(options).forEach((objKey) => {
      if (
        typeof options[objKey] === 'string' ||
        typeof options[objKey] === 'number'
      )
        fileContent = fileContent.replace(
          new RegExp(`#${objKey}#`, 'gi'),
          options[objKey]
        );
    });
  }

  // return the template
  return fileContent;
};

// Export the function
module.exports = replaceContent;

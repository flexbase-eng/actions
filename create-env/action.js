const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const fileName = core.getInput('file_name');
const filePath = core.getInput('file_path');
const fileData = core.getInput('file_data');
const fileFormat = core.getInput('file_format');

try {
  const outputFile = path.join(filePath, fileName);

  const existingBuffer = fs.existsSync(outputFile) ? fs.readFileSync(outputFile) : Buffer.from('');

  const existing =
    fileFormat === 'json'
      ? { ...JSON.parse(existingBuffer), ...JSON.parse(fileData) }
      : { ...dotenv.parse(existingBuffer), ...dotenv.parse(fileData) };

  const output =
    fileFormat === 'json'
      ? JSON.stringify(existing)
      : Object.entries(existing)
          .map((x) => `${x[0]}=${x[1]}`)
          .join('\n');

  fs.writeFile(outputFile, output, function (error) {
    if (error) {
      core.setFailed(error.message);
    }
  });
} catch (error) {
  core.setFailed(error.message);
}

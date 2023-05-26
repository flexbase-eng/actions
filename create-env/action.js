const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const fileName = core.getInput('file_name');
const filePath = core.getInput('file_path');
const fileData = core.getInput('file_data');
const fileDataFormat = core.getInput('file_data_format');
const fileFormat = core.getInput('file_format');

const isNumber = (value) => {
  if (typeof value === 'number') {
    return true;
  }

  return typeof value === 'string' && !Number.isNaN(value) && !Number.isNaN(Number.parseFloat(value));
};

const isBoolean = (value) => {
  if (typeof value === 'boolean') {
    return true;
  }

  if (typeof value !== 'string') {
    return false;
  }

  if (['true', '1', 'yes', 'on', 'false', '0', 'no', 'off'].includes(value.trim().toLowerCase())) return true;

  return false;
};

const getType = (value) => {
  if (isNumber(value)) {
    return 'number';
  }
  if (isBoolean(value)) {
    return 'boolean';
  }

  return typeof value;
};

const dotenvParse = (data) => {
  const obj = {};

  Object.entries(dotenv.parse(data)).forEach((entry) => {
    const entryType = getType(entry[1]);
    obj[entry[0]] = entryType === 'number' ? Number(entry[1]) : entryType === 'boolean' ? Boolean(entry[1]) : entry[1];
  });

  return obj;
};

function main() {
  try {
    const outputFile = path.join(filePath, fileName);

    let existingObj = {};

    if (fs.existsSync(outputFile)) {
      if (fileFormat === 'javascript') {
        const jsPath = path.join(process.cwd(), outputFile);
        core.info(`${jsPath}`);
        existingObj = require(jsPath);
      } else {
        const existingBuffer = fs.readFileSync(outputFile);
        existingObj = fileFormat === 'dotenv' ? dotenv.parse(existingBuffer) : JSON.parse(existingBuffer);
      }
    }

    const parsedFileData = fileDataFormat == 'dotenv' ? dotenvParse(fileData) : JSON.parse(fileData);

    const existing = { ...existingObj, ...parsedFileData };

    let output = '';

    if (fileFormat === 'javascript') {
      output = `export default ${JSON.stringify(jsonObj)} ;`;
    } else if (fileFormat === 'dotenv') {
      output = Object.entries(existing)
        .map((x) => `${x[0]}=${x[1]}`)
        .join('\n');
    } else if (fileFormat === 'json') {
      output = JSON.stringify(existing);
    }

    fs.writeFile(outputFile, output, function (error) {
      if (error) {
        core.setFailed(error.message);
      }
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();

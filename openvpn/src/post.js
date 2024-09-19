import core from '@actions/core';
import { exec } from './exec.js';

export const post = (pid, configPath) => {
  if (pid) {
    try {
      exec(`sudo kill ${pid} || true`);
    } catch (error) {
      core.warning(error.message);
    }
  }

  if (configPath) {
    try {
      exec(`sudo rm -rf ${configPath}`);
    } catch (error) {
      core.warning(error.message);
    }
  }
};

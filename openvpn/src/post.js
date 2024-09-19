import core from '@actions/core';
import { exec } from './exec.js';

export const post = () => {
  const configPath = core.getState('configPath');
  const pid = core.getState('pid');

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

post();

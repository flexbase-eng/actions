import core from '@actions/core';
import { exec } from './exec.js';

export const pre = () => {
  try {
    core.info(`Installing OpenVPN`);

    exec(`sudo apt update`);
    exec(`sudo apt install -y openvpn openvpn-systemd-resolved`);
  } catch (error) {
    core.error(error.message);
    throw error;
  }
};

pre();

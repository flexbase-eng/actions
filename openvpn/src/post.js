import core from '@actions/core';
import { exec } from './exec.js';

export const post = configPath => {
  if (!configPath) {
    return;
  }
  try {
    // suppress warning even if the process already killed
    // exec(`sudo kill ${pid} || true`);

    exec(
      'sudo openvpn3 session-manage --session-path $(sudo openvpn3 sessions-list | grep -io /net/openvpn/v3/sessions/[a-z0-9]*) --disconnect'
    );

    exec(`sudo rm -rf ${configPath}`);
  } catch (error) {
    core.warning(error.message);
  }
};

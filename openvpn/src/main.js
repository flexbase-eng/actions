import fs from 'fs';
import path, { sep } from 'path';
import core from '@actions/core';
import { exec } from './exec.js';
import { Tail } from 'tail';

export const main = callback => {
  const config = core.getInput('config', { required: true });

  const configPath = fs.mkdtempSync(`${process.env.HOME}${sep}`);

  const configFile = path.join(configPath, 'config.ovpn');

  core.info(`writing config to ${configFile}`);

  fs.writeFileSync(configFile, config);

  // prepare log file
  fs.writeFileSync('openvpn.log', '');
  const tail = new Tail('openvpn.log');

  try {
    exec(`sudo openvpn --config ${configFile} --daemon --log openvpn.log --writepid openvpn.pid`);
  } catch (error) {
    core.error(fs.readFileSync('openvpn.log', 'utf8'));
    tail.unwatch();
    throw error;
  }

  tail.on('line', data => {
    core.info(data);
    if (data.includes('Initialization Sequence Completed')) {
      tail.unwatch();
      clearTimeout(timer);
      const pid = fs.readFileSync('openvpn.pid', 'utf8').trim();
      core.info(`VPN connected successfully. Daemon PID: ${pid}`);
      callback(pid, configPath);
    }
  });

  const timer = setTimeout(() => {
    core.setFailed('VPN connection failed.');
    tail.unwatch();
  }, 15000);
};

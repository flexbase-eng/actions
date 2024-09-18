import fs from 'fs';
import path, { sep } from 'path';
import core from '@actions/core';
import { exec } from './exec.js';

export const main = callback => {
  const config = core.getInput('config', { required: true });
  const autoloadConfig = core.getInput('autoload-config');

  const configPath = fs.mkdtempSync(`${process.env.HOME}${sep}`);

  const configFile = path.join(configPath, 'config.ovpn');
  const autoloadFile = path.join(configPath, 'config.autoload');

  core.info(`writing config to ${configFile}`);

  fs.writeFileSync(configFile, config);

  if (autoloadConfig) {
    core.info(`writing autoload to ${autoloadFile}`);
    fs.writeFileSync(autoloadFile, autoloadConfig);
  }

  // prepare log file
  // fs.writeFileSync('openvpn.log', '');
  // const tail = new Tail('openvpn.log');

  try {
    exec(`sudo openvpn3-autoload --directory ${configPath}`);

    // exec(`sudo openvpn --config ${config} --daemon --log openvpn.log --writepid openvpn.pid`);
  } catch (error) {
    throw error;
  }

  exec(`sudo openvpn3 sessions-list`);

  callback(configPath);
  // tail.on('line', data => {
  //   core.info(data);
  //   if (data.includes('Initialization Sequence Completed')) {
  //     tail.unwatch();
  //     clearTimeout(timer);
  //     const pid = fs.readFileSync('openvpn.pid', 'utf8').trim();
  //     core.info(`VPN connected successfully. Daemon PID: ${pid}`);
  //     callback(pid);
  //   }
  // });

  // const timer = setTimeout(() => {
  //   core.setFailed('VPN connection failed.');
  //   tail.unwatch();
  // }, 15000);
};

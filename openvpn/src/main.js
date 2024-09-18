import fs from 'fs';
import path from 'path';
import core from '@actions/core';
import exec from './exec.js';
// const Tail = require('tail').Tail;

export const run = callback => {
  const config = core.getInput('config', { required: true });
  const autoloadConfig = core.getInput('autoload-config');

  const configPath = fs.mkdtempSync('.openvpn');

  fs.writeFileSync(path.join(configPath, 'config.ovpn'), config);

  if (autoloadConfig) {
    fs.writeFileSync(path.join(configPath, 'config.autoload'), autoloadConfig);
  }

  // prepare log file
  // fs.writeFileSync('openvpn.log', '');
  // const tail = new Tail('openvpn.log');

  try {
    exec(`sudo openvpn3-autoload --directory ${configPath}`);

    exec(`while [ -z "$(sudo openvpn3 sessions-list | grep -io 'client connected')" ]; do sleep 0.1; done`);

    // exec(`sudo openvpn --config ${config} --daemon --log openvpn.log --writepid openvpn.pid`);
  } catch (error) {
    // core.error(fs.readFileSync('openvpn.log', 'utf8'));
    // tail.unwatch();
    throw error;
  }

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

export default run;

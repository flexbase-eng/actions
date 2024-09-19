import core from '@actions/core';
import { main } from './main.js';
import { post } from './post.js';

const isPost = core.getState('isPost');

if (isPost) {
  // cleanup
  const configPath = core.getState('configPath');
  const pid = core.getState('pid');
  try {
    post(pid, configPath);
  } catch (error) {
    core.setFailed(error.message);
  }
} else {
  // main
  try {
    main((pid, configPath) => {
      core.saveState('pid', pid);
      core.saveState('configPath', configPath);
    });
  } catch (error) {
    core.setFailed(error.message);
  } finally {
    // cf. https://github.com/actions/checkout/blob/main/src/state-helper.ts
    core.saveState('isPost', 'true');
  }
}

const { exec } = require('child_process');

exec('yarn outdated --color', (error, stdout) => {
  console.log(stdout);
});

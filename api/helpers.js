const fs = require('fs');

module.exports = {
  error: (res, message, code = 500) => {
    console.log('test');
    console.log(message);
    if (message instanceof Error) {
      message = message.toString();
    }

    res.status(code);
    res.send(message);
  },

  makeDirectory: (directoryName) => {
    const { execSync } = require('child_process');
    execSync('mkdir -p ' + directoryName);
  },

  randomString: (length = 10) =>
    Array(length+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, length)
}

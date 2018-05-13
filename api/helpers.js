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

  randomString: (length = 10) => {
    Array(length+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, length)
  },

  clone: (x) => {
    return JSON.parse(JSON.stringify(x));
  },

  transpose: (array) => {
    return array[0].map((col, i) => array.map(row => row[i]));
  },

  shuffle: (a) => {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
  },

  remove: (arr, elem) => {
    let next = [];
    arr.forEach((x) => {
      if (x !== elem) {
        next.push(x)
      }
    });
    return next;
  }
}

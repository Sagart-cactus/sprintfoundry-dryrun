'use strict';

function format(level, message, fields) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...fields,
  });
}

function createLogger(sink) {
  const output = sink || process.stdout;

  return {
    info(message, fields = {}) {
      output.write(`${format('info', message, fields)}\n`);
    },
    warn(message, fields = {}) {
      output.write(`${format('warn', message, fields)}\n`);
    },
    error(message, fields = {}) {
      output.write(`${format('error', message, fields)}\n`);
    },
  };
}

module.exports = {
  createLogger,
};

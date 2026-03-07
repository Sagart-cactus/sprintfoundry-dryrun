function helloWorld() {
  return "Hello, world!";
}

if (require.main === module) {
  process.stdout.write(`${helloWorld()}\n`);
}

module.exports = {
  helloWorld,
};

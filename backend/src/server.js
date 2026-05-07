const app = require("./app");
const env = require("./config/env");

console.log("Starting backend in no-database dev mode...");

app.listen(env.port, () => {
  console.log(`Backend listening on port ${env.port}`);
});

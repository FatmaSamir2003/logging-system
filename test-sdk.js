const Logger = require("./sdk/logger");

async function testLogs() {
  Logger.init({
    apiKey: "172b2a08-0b68-4348-b51f-39a4e0a26967",
    appName: "shopping",
  });

  await Logger.log({
    message: "Payment failed",
    level: "ERROR",
  });

  await Logger.log({
    message: "User added item to cart",
    level: "INFO",
  });

  await Logger.log({
    message: "Slow database query",
    level: "WARN",
  });

  console.log("All logs sent");
}

testLogs();

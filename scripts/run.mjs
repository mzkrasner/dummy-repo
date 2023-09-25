import ora from "ora";

import { spawn } from "child_process";
import { EventEmitter } from "events";
import { writeComposite } from "./composites.mjs";

const events = new EventEmitter();
const spinner = ora();

const bootstrap = async () => {
  try {
    spinner.info("[Authenticating] authenticating session");
    await writeComposite(spinner);
    spinner.succeed("Authenticating] authenticating complete");
  } catch (err) {
    spinner.fail(err.message);
    // ceramic.kill()
    throw err;
  }
};

const next = async () => {
  const next = spawn("npm", ["run", "nextDev"]);
  spinner.info("[NextJS] starting nextjs app");
  next.stdout.on("data", (buffer) => {
    console.log("[NextJS]", buffer.toString());
  });
};

const graphiql = async () => {
  spinner.info("[GraphiQL] starting graphiql");
  const graphiql = spawn('node', ['./scripts/graphiql.mjs'])
  spinner.succeed("[GraphiQL] graphiql started");
  graphiql.stdout.on('data', (buffer) => {
    console.log('[GraphiqQL]',buffer.toString())
  })
}

const start = async () => {
  await bootstrap();
  await graphiql()
  await next();
};

start();

process.on("SIGTERM", () => {
  ceramic.kill();
});
process.on("beforeExit", () => {
  ceramic.kill();
});
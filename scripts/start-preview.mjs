import { spawn } from "node:child_process";
import { createServer } from "node:net";
import process from "node:process";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 3001;
const MAX_PORT_ATTEMPTS = 20;

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      env: process.env,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed: ${command} ${args.join(" ")}`));
    });
  });
}

function canListenOnPort(host, port) {
  return new Promise((resolve) => {
    const server = createServer();

    server.once("error", () => {
      resolve(false);
    });

    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, host);
  });
}

async function findAvailablePort(host, startPort) {
  for (let offset = 0; offset < MAX_PORT_ATTEMPTS; offset += 1) {
    const port = startPort + offset;

    if (await canListenOnPort(host, port)) {
      return port;
    }
  }

  throw new Error(`No free preview port found between ${startPort} and ${startPort + MAX_PORT_ATTEMPTS - 1}.`);
}

async function main() {
  const host = process.env.PREVIEW_HOST || DEFAULT_HOST;
  const requestedPort = Number.parseInt(process.env.PORT || String(DEFAULT_PORT), 10);
  const port = await findAvailablePort(host, requestedPort);

  if (port !== requestedPort) {
    console.log(`Port ${requestedPort} is busy. Starting preview on ${host}:${port} instead.`);
  }

  await runCommand(process.execPath, ["./node_modules/next/dist/bin/next", "build"]);

  console.log(`Production preview will run at http://${host}:${port}`);
  await runCommand(process.execPath, [
    "./node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    host,
    "--port",
    String(port),
  ]);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

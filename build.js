const esbuild = require("esbuild");
const { filelocPlugin } = require("esbuild-plugin-fileloc");

const WATCH = process.argv.includes("--watch");

const baseOptions = {
  logLevel: "info",
  bundle: true,
  absWorkingDir: process.cwd(),
};

const targetOptions = [
  {
    target: "es2017",
    entryPoints: ["client/index.ts"],
    outfile: "./build/client/index.js",
    ...baseOptions,
  },
  {
    target: "node16",
    entryPoints: ["server/index.ts"],
    platform: "node",
    outfile: "./build/server/index.js",
    plugins: [filelocPlugin()],
    ...baseOptions,
  },
];

const build = async () => {
  try {
    const client = await esbuild.context(targetOptions[0]);
    const server = await esbuild.context(targetOptions[1]);

    if (WATCH) {
      client.watch();
      server.watch();
    } else {
      client.rebuild().then(() => {
        console.log("[ESBuild] Client build complete");
      });

      client.dispose();

      server.rebuild().then(() => {
        console.log("[ESBuild] Server build complete");
      });

      server.dispose();
    }
  } catch (error) {
    console.log("[ESBuild] Build failed with error");
    console.error(e);
    process.exit(1);
  }
};

build();

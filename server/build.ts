
import { build } from "esbuild";
import { glob } from "glob";

async function buildServer() {
  const entryPoints = await glob("server/**/*.ts");
  
  await build({
    entryPoints,
    platform: "node",
    target: "node18",
    format: "cjs",
    outdir: "dist",
    bundle: false,
  });
}

buildServer().catch(console.error);

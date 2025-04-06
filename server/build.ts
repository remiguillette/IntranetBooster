
import { build } from "esbuild";
import { glob } from "glob";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";

const buildServer = async () => {
  const entryPoints = await glob("server/**/*.ts");
  
  try {
    // Ensure dist directory exists
    if (!existsSync("dist")) {
      await mkdir("dist", { recursive: true });
    }
    
    await build({
      entryPoints,
      outdir: "dist",
      platform: "node",
      target: "node18",
      format: "esm",
      bundle: true,
      packages: "external",
      outbase: ".", // Changed to "." to maintain correct output structure
    });
    console.log("Build completed successfully");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};

buildServer();

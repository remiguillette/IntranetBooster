
import { build } from "esbuild";
import { glob } from "glob";

const buildServer = async () => {
  const entryPoints = await glob("server/**/*.ts");
  
  try {
    await build({
      entryPoints,
      outdir: "dist",
      platform: "node",
      target: "node18",
      format: "esm",
      bundle: true,
      packages: "external",
      outbase: "server", // Changed from "." to "server" to get correct path structure
    });
    console.log("Build completed successfully");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};

buildServer();

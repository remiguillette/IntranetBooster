
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
      format: "cjs",
      bundle: true,
      packages: "external",
      outExtension: { '.js': '.cjs' },
    });
    console.log("Build completed successfully");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};

buildServer();

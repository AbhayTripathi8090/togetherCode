import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../../..");

const defaultCorsOrigins = ["http://localhost:5173"];

const parseOrigins = (value) => {
  if (!value) {
    return defaultCorsOrigins;
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  corsOrigins: parseOrigins(process.env.CLIENT_URLS),
  pistonApiUrl:
    process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston/execute",
  serveStaticFrontend: process.env.SERVE_STATIC_FRONTEND === "true",
  frontendDistPath: path.resolve(projectRoot, "frontend", "dist"),
};

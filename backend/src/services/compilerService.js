import axios from "axios";

import { env } from "../config/env.js";

export async function executeCode({ code, language, version }) {
  const response = await axios.post(env.pistonApiUrl, {
    language,
    version,
    files: [{ content: code }],
  });

  return response.data;
}

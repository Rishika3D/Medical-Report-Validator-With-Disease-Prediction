import { fileURLToPath } from "url"
import { dirname } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a self-contained server bundle for small Docker images.
  output: "standalone",
  // Pin the file-tracing/workspace root to this app so the standalone bundle
  // isn't nested under the host path when other lockfiles exist on the machine.
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

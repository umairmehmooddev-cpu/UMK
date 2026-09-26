import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Do not add an `env` map. Next inlines those values into the client bundle.
  // Server secrets stay in process.env inside Server Components and Route Handlers.
};

export default nextConfig;

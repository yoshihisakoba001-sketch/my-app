import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "my-app-alpha-six-49.vercel.app" }],
        destination: "https://runplan.jp/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

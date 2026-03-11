import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  typedRoutes: true,
  experimental: {
    instantNavigationDevToolsToggle: true,
  },
};

export default withWorkflow(nextConfig);

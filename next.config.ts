import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Rule for video files
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|swf|ogv)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/videos',
          outputPath: 'static/videos',
          name: '[name].[hash].[ext]',
        },
      },
    });

    // Rule for GLSL shader files
    config.module.rules.push({
      test: /\.(glsl|vs|fs)$/,
      use: {
        loader: 'raw-loader',
      },
      exclude: /node_modules/,
    });

    return config;
  },
};

export default nextConfig;

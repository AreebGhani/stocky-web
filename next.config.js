const { version } = require('./package.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    images: {
        loader: "custom",
        unoptimized: true,
    },
}

module.exports = nextConfig

module.exports = {
    publicRuntimeConfig: {
        version,
    },
};
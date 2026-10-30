import nextConfig from "eslint-config-next/core-web-vitals"

export default [
  ...nextConfig,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/immutability": "off",
    },
  },
]

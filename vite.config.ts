import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import commonjsExternals from "vite-plugin-commonjs-externals";

// https://vitejs.dev/config/
const commonjsPackages = [
  "electron",
  "electron/main",
  "electron/common",
  "electron/renderer",
  "original-fs",
  // ...builtinModules,
  // ...Object.keys(pkg.dependencies).map(
  //   (name) => new RegExp("^" + escapeRegExp(name) + "(\\/.+)?$")
  // ),
];
export default defineConfig({
  server: {
    proxy: {
      "/handler": "http://localhost:8080/",
    },
  },
  plugins: [react(), commonjsExternals({ externals: commonjsPackages })],
});

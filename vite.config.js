import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { config } from "dotenv";
import { resolve } from "path";

// https://vitejs.dev/config/
export default ({}) => {
    const env = loadEnv(process.cwd(), "");
    config({ path: resolve(__dirname, ".env") });
    return defineConfig({
        plugins: [react()],
        define: {
            "process.env": process.env,
        },
        commonjsOptions: {
            esmExternals: true,
        },
        server: {
            host: process.env.HOST || "localhost",
            port: process.env.PORT || "5173",
        },
    });
};

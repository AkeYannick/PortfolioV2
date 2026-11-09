import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Port 5175 : c'est l'origine déjà présente dans CORS_ORIGINES du backend.
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: { port: 5175, strictPort: true },
});

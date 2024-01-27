/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { VitePWA } from "vite-plugin-pwa";
// export default defineConfig({
//   plugins: [
//     react(),
//     VitePWA({
//       manifest: {
//         name: "React-vite-app",
//         short_name: "react-vite-app",
//         description: "I am a simple vite app",
//         icons: [
//           {
//             src: "/icon.png",
//             sizes: "192x192",
//             type: "image/png",
//             purpose: "any mmaskable",
//           },
//         ],
//       },
//     } as any),
//   ],
// });

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['blurhash'],
  }
})

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router"],
          "chart-vendor": ["apexcharts", "react-apexcharts"],
          "calendar-vendor": ["@fullcalendar/core", "@fullcalendar/react", "@fullcalendar/daygrid", "@fullcalendar/timegrid", "@fullcalendar/interaction", "@fullcalendar/list"],
          "supabase-vendor": ["@supabase/supabase-js"],
          "ui-vendor": ["flatpickr", "react-dropzone"],
        },
      },
    },
  },
});

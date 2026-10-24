import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.platonissex.makeupcamera",
  appName: "化妆相机",
  webDir: "web/dist",
  backgroundColor: "#100E0C",
  server: {
    androidScheme: "https",
  },
  android: {
    backgroundColor: "#100E0C",
  },
  plugins: {
    SystemBars: {
      initialViewportFitValueHint: "cover",
      style: "DARK",
    },
  },
};

export default config;

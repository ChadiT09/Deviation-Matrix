import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.oncehuman.deviationmatrix",
  appName: "Deviation Matrix",
  webDir: "dist",
  backgroundColor: "#070c12",
  android: {
    backgroundColor: "#070c12",
    allowMixedContent: true,
  },
  plugins: {
    Haptics: {},
    LocalNotifications: {
      smallIcon: "ic_stat_notification",
      iconColor: "#00f5ff",
    },
  },
};

export default config;

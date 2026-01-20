const Config = {
  expo: {
    name: "FlexiHome Connect",
    owner: "inesctecdev",
    slug: "hedge-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./app/assets/adaptive-icon.png",
    notification: {
      icon: "./app/assets/icons/leaf.png",
      color: "#ffffff",
    },
    splash: {
      image: "./app/assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#fff8dc",
    },
    updates: {
      url: "https://u.expo.dev/9bc64fed-b250-4a15-b8c3-2b011edfa0c0",
      fallbackToCacheTimeout: 0,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      buildNumber: "1",
      bundleIdentifier: "pt.inesctec.hedgeiot",
      supportsTablet: true,
      splash: {
        tabletImage: "./app/assets/splash-icon.png",
        backgroundColor: "#fff8dc",
        resizeMode: "contain",
      },
    },
    android: {
      package: "pt.inesctec.hedgeiot",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./app/assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      splash: {
        mdpi: "./app/assets/splash-icon.png",
        hdpi: "./app/assets/splash-icon.png",
        xxhdpi: "./app/assets/splash-icon.png",
        backgroundColor: "#fff8dc",
        resizeMode: "contain",
      },
      permissions: ["android.permission.DETECT_SCREEN_CAPTURE"],
    },
    web: {
      favicon: "./app/assets/favicon.png",
    },
    description: "Hedge IOT project app",
    extra: {
      eas: {
        projectId: "9bc64fed-b250-4a15-b8c3-2b011edfa0c0",
      },
      api_url: process.env.API_URL,
      policy: process.env.APP_POLICY_VERSION,
    },
  },
};

export default { ...Config };
import getGatewayProdKey from "@/plugin/gateway";

async function initializeConfig() {
  const build = "development"; //development or production
  const gateway_server = "V7vnmGY8uHAnTnXrGGKacdoD0D6WVYDQ";
  const unixtime_dev = "1727646061508";
  const gateway_dev = "XQeFHDaRSocnoUjxBsnykoWJIWZXJkZh";

  const config = {
    build: build,
    default_url: "http://localhost:9002",
    gateway_server: gateway_server,
    unixtime: unixtime_dev,
    gateway_key: gateway_dev,
  };

  if (config.build == "production") {
    const gateway_key = config.gateway_server;
    const unixtime = Date.now();
    config.unixtime = unixtime.toString();
    try {
      const result = await getGatewayProdKey(unixtime, gateway_key);
      config.gateway_key = result;
    } catch (error) {
      console.error("Error getting gateway key:", error);
    }
  }

  return config;
}

const configPromise = initializeConfig();

export default configPromise;

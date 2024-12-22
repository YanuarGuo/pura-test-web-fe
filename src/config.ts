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

  return config;
}

const configPromise = initializeConfig();

export default configPromise;

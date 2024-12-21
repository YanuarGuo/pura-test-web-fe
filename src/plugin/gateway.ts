
const encryptHMAC = async (unixTime: any, apiKey: any) => {
  const currentDate = new Date().toISOString().substring(0, 10);
  const combinedString = apiKey + currentDate;

  // Create an encoder for the strings
  const encoder = new TextEncoder();
  const keyData = encoder.encode(combinedString); // Combine apiKey and currentDate
  const plainData = encoder.encode(unixTime.toString()); // Convert unixTime to Uint8Array

  // Import the key for HMAC usage
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw", keyData, { name: "HMAC", hash: { name: "SHA-256" } },
    false, ["sign"]
  );

  // Sign (encrypt) the plain data with the HMAC key
  const signature = await window.crypto.subtle.sign("HMAC", cryptoKey, plainData);

  // Convert ArrayBuffer to hex string
  const signatureArray = Array.from(new Uint8Array(signature));
  const signatureHexString = signatureArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return signatureHexString;
}

async function getGatewayProdKey(unixTime: any, apiKey: any) {
  const gateway_prod = await encryptHMAC(unixTime, apiKey);
  return gateway_prod;
}

export default getGatewayProdKey;
const https = require("https");

// Your Supabase project URL and anon key
const SUPABASE_URL = "https://rocpjuacstaigysypokg.supabase.co";
// IMPORTANT: Use the SERVICE_ROLE_KEY for this script to bypass RLS
const SUPABASE_SERVICE_ROLE_KEY = "YOUR_SERVICE_ROLE_KEY_HERE";

async function sendNotification() {
  const options = {
    hostname: "rocpjuacstaigysypokg.supabase.co",
    port: 443,
    path: "/functions/v1/evening-reminder",
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log("Response:", data);
        resolve(data);
      });
    });

    req.on("error", (error) => {
      console.error("Error:", error);
      reject(error);
    });

    req.end();
  });
}

// Run the function
sendNotification()
  .then(() => {
    console.log("Notification sent successfully!");
  })
  .catch((error) => {
    console.error("Failed to send notification:", error);
  });

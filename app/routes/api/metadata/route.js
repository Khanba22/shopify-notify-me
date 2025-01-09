const express = require("express");
const { Shopify } = require("@shopify/shopify-api");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Shopify API client
Shopify.Context.initialize({
  API_KEY: "3f3fb4174c4513e8cb70338a6d0a5546",
  API_SECRET_KEY: "25d86b9de54a15aa2197a1f4443b910c",
  SCOPES: process.env.SHOPIFY_API_SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  IS_EMBEDDED_APP: true,
  API_VERSION: Shopify.ApiVersion.October23,
});

app.get("/fetch-store-info", async (req, res) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res, true);
    if (!session) {
      return res.status(401).send("Unauthorized");
    }

    // Fetch theme details
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const themesResponse = await client.get({
      path: "themes",
    });

    // Extract theme details
    const theme = themesResponse.body.themes.find((theme) => theme.role === "main");
    const themeId = theme?.id;

    // Log details
    console.log("Store Details:");
    console.log(`Store: ${session.shop}`);
    console.log(`Theme ID: ${themeId}`);
    console.log(`API Password: ${session.accessToken}`);

    res.status(200).json({
      message: "Store details fetched successfully",
      store: session.shop,
      themeId: themeId,
      accessToken: session.accessToken,
    });
  } catch (error) {
    console.error("Error fetching store info:", error);
    res.status(500).send("Error fetching store details");
  }
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

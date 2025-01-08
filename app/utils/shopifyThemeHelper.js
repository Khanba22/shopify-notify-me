import fetch from "node-fetch";

export async function addHelloWorldToTheme(shop, accessToken) {
  try {
    // Step 1: Get Active Theme ID
    const themeId = await getActiveTheme(shop, accessToken);

    // Step 2: Fetch Current Liquid Content
    const liquidContent = await getThemeLiquidContent(shop, accessToken, themeId);

    // Step 3: Append "Hello World" and Update Liquid File
    const result = await updateThemeLiquidContent(shop, accessToken, themeId, liquidContent);

    console.log("Hello World added successfully:", result);
    return result;
  } catch (error) {
    console.error("Error adding Hello World to theme:", error);
    throw error;
  }
}

async function getActiveTheme(shop, accessToken) {
  const url = `https://${shop}/admin/api/2023-01/themes.json`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  const activeTheme = data.themes.find((theme) => theme.role === "main");
  return activeTheme.id;
}

async function getThemeLiquidContent(shop, accessToken, themeId) {
  const url = `https://${shop}/admin/api/2023-01/themes/${themeId}/assets.json?asset[key]=layout/theme.liquid`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data.asset.value;
}

async function updateThemeLiquidContent(shop, accessToken, themeId, liquidContent) {
  const url = `https://${shop}/admin/api/2023-01/themes/${themeId}/assets.json`;

  const updatedContent = liquidContent + `\n\n<!-- Hello World Added -->\n<div>Hello World</div>\n`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      asset: {
        key: "layout/theme.liquid",
        value: updatedContent,
      },
    }),
  });

  const data = await response.json();
  return data;
}

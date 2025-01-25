export async function updateProductJson(shop, accessToken, themeId, updatedContent) {
  await fetch(
    `https://${shop}/admin/api/2023-01/themes/${themeId}/assets.json`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        asset: {
          key: "templates/product.json",
          value: updatedContent,
        },
      }),
    }
  );
}

export function modifyProductJson(productJson, newBlock) {
  if (!productJson.blocks) {
    productJson.blocks = [];
  }

  productJson.blocks.push(newBlock);
  return JSON.stringify(productJson, null, 2); // Convert back to JSON string
}

export async function getProductJson(shop, accessToken, themeId) {
  const response = await fetch(
    `https://${shop}/admin/api/2023-01/themes/${themeId}/assets.json?asset[key]=templates/product.json`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
    }
  );

  const data = await response.json();
  return JSON.parse(data.asset.value); // Parse JSON content
}

export async function getActiveThemeId(shop, accessToken) {
  const response = await fetch(`https://${shop}/admin/api/2023-01/themes.json`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
  });

  const data = await response.json();
  const activeTheme = data.themes.find((theme) => theme.role === "main");
  return activeTheme.id;
}

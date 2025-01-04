import { addHelloWorldToTheme } from "~/utils/shopifyThemeHelper";

export async function loader({ request }) {
  // This endpoint requires a GET or POST request to modify the theme
  const shop = "your-shop-name.myshopify.com"; // Replace with the shop domain dynamically
  const accessToken = "your-access-token"; // Replace with your actual access token

  try {
    // Call the function to add "Hello World" to the theme
    await addHelloWorldToTheme(shop, accessToken);
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error modifying theme:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

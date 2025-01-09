console.log("Running setup-button.js");
const button = document.querySelectorAll(".notify-me-button");


const fetchSettings = async () => {
  try {
    // Extract the shop domain from the query parameter
    const shop = window.location.hostname.split('.')[0];

    if (!shop) {
      throw new Error('Shop domain is missing');
    }

    // Construct the Admin API URL
    const apiUrl = `/app/settings`; // Adjust the version to match your app's setup
    console.log("apiUrl", apiUrl);

    // Fetch the settings data using the Admin API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Shop-Domain': shop, // Pass shop domain to identify the store
        'Authorization': `Bearer ${window.api_token}`, // Use your app's Shopify access token here
      },
      credentials: 'include', // Include cookies for session authentication
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch settings: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the fetched settings
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null; // Handle errors gracefully
  }
};

// Use fetched settings
// fetchSettings().then((settings) => {
//   if (settings) {
//     button.forEach((btn) => {
//       btn.innerHTML = settings.buttonText;
//     });
//   }
// });

import { useLoaderData, useFetcher, useOutletContext } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Banner,
  Button,
  Form,
  FormLayout,
  Layout,
  Page,
  Select,
  TextField,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import { getActiveThemeId, getProductJson, modifyProductJson, updateProductJson } from "./utils/shopifyThemeHelper";

// Loader function to authenticate and fetch metadata
export const loader = async ({ request }) => {
  const { shop, apiKey, appUrl } = await authenticate.admin(request);

  const metadata = await prisma.metadata.findFirst();
  return {
    metadata: metadata || {},
    shop,
    apiKey,
    appUrl,
  };
};

// Action function to handle form submissions
export const action = async ({ request }) => {
  try {
    const formData = await request.formData();
    const webhookLink = formData.get("webhookLink");
    const buttonText = formData.get("buttonText");
    const language = formData.get("language");
    const shop = formData.get("shop");
    const accessToken = formData.get("accessToken"); // Pass access token from context

    // Save form data to the database
    const metadata = await prisma.metadata.upsert({
      where: { id: 1 },
      update: { webhookLink, buttonText, language },
      create: { webhookLink, buttonText, language },
    });

    // Add block to product.json
    const themeId = await getActiveThemeId(shop, accessToken);
    const productJson = await getProductJson(shop, accessToken, themeId);

    const updatedProductJson = modifyProductJson(productJson, {
      type: "random-block",
      content: `Random text: ${buttonText}`,
    });

    await updateProductJson(shop, accessToken, themeId, updatedProductJson);

    return metadata;
  } catch (error) {
    console.error("Error in action:", error);
    return {
      error: "Failed to save settings or modify product.json. Please try again.",
    };
  }
};

// Main settings page component
export default function SettingsPage() {
  const { metadata, shop, apiKey, appUrl } = useLoaderData();
  const fetcher = useFetcher();

  const [metaData, setMetaData] = useState({
    webhookLink: metadata?.webhookLink || "",
    buttonText: metadata?.buttonText || "",
    language: metadata?.language || "en",
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  // Handle fetcher state changes
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.error) {
        setIsError(true);
      } else {
        setIsSuccess(true);
        setIsError(false);
      }
    }
  }, [fetcher]);

  // Automatically hide success message after 5 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [isSuccess]);

  // Handle field changes
  const handleChange = (field) => (value) => {
    setMetaData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    const formData = new FormData();
    Object.entries(metaData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    fetcher.submit(formData, { method: "post" });
  };

  return (
    <Page>
      <TitleBar title="Settings" />
      <Layout>
        {isSuccess && (
          <Banner
            onDismiss={() => setIsSuccess(false)}
            status="success"
            title="Success"
          >
            Your settings have been saved successfully.
          </Banner>
        )}
        {isError && (
          <Banner status="critical" title="Error">
            Failed to save settings. Please try again.
          </Banner>
        )}
        <Form onSubmit={handleSubmit}>
          <FormLayout>
            <TextField
              label="Webhook Link"
              value={metaData.webhookLink}
              onChange={handleChange("webhookLink")}
              placeholder="Enter your webhook link"
              disabled={fetcher.state === "submitting"}
              helpText="Enter the URL where webhook notifications will be sent"
            />
            <TextField
              label="Button Text"
              value={metaData.buttonText}
              onChange={handleChange("buttonText")}
              placeholder="Enter button text"
              disabled={fetcher.state === "submitting"}
              maxLength={255}
            />
            <Select
              label="Language"
              options={[
                { label: "English", value: "en" },
                { label: "French", value: "fr" },
                { label: "Spanish", value: "es" },
              ]}
              value={metaData.language}
              onChange={handleChange("language")}
              disabled={fetcher.state === "submitting"}
            />
            <TextField
              label="API Key"
              value={apiKey}
              readOnly
              helpText="This is your Shopify App API Key"
            />
            <TextField
              label="Shop"
              value={shop}
              readOnly
              helpText="This is the shop domain"
            />
            <TextField
              label="App URL"
              value={appUrl}
              readOnly
              helpText="This is your app URL"
            />
            <Button primary submit loading={fetcher.state === "submitting"}>
              {fetcher.state === "submitting" ? "Saving..." : "Save Settings"}
            </Button>
          </FormLayout>
        </Form>
      </Layout>
    </Page>
  );
}

import { useLoaderData, useFetcher } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Button,
  Form,
  FormLayout,
  Layout,
  Page,
  Select,
  TextField,
} from "@shopify/polaris";
import { useState, useEffect } from "react";
import prisma from "../db.server";

export async function loader() {
  // Fetch metadata from the database
  const metadata = await prisma.metadata.findFirst();
  return new Response(JSON.stringify(metadata || {}), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const webhookLink = formData.get("webhookLink");
    const buttonText = formData.get("buttonText");
    const language = formData.get("language");

    // Update or create the metadata record
    const metadata = await prisma.metadata.upsert({
      where: { id: 1 }, // Assuming you're managing a single record
      update: { webhookLink, buttonText, language },
      create: { webhookLink, buttonText, language },
    });

    return new Response(JSON.stringify(metadata), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in action:", error);

    return new Response(JSON.stringify({ error: "Failed to save metadata" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default function SettingsPage() {
  const metadata = useLoaderData(); // Get metadata from the loader
  const fetcher = useFetcher();

  const [metaData, setMetaData] = useState({
    webhookLink: metadata?.webhookLink || "",
    buttonText: metadata?.buttonText || "",
    language: metadata?.language || "en", // Default language to 'en'
  });

  const [statusMessage, setStatusMessage] = useState(null); // Status message text

  const handleChange = (field) => (value) => {
    setMetaData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("webhookLink", metaData.webhookLink);
    formData.append("buttonText", metaData.buttonText);
    formData.append("language", metaData.language);

    setStatusMessage("Saving your edits..."); // Update status to "Saving your edits"
    fetcher.submit(formData, { method: "post" }); // Submit to the same route ("/app/settings")
  };

  // Update the status message when fetcher state changes
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setStatusMessage("Changes applied");
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <Page>
      <TitleBar title="Settings" />
      <Layout>
        <Form onSubmit={handleSubmit}>
          <FormLayout>
            <TextField
              label="Webhook Link"
              value={metaData.webhookLink}
              onChange={handleChange("webhookLink")}
              placeholder="Enter your webhook link"
            />
            <TextField
              label="Button Text"
              value={metaData.buttonText}
              onChange={handleChange("buttonText")}
              placeholder="Enter button text"
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
            />
            {statusMessage && (
              <p style={{ marginTop: "1rem", color: "green" }}>
                {statusMessage}
              </p>
            )}

            <Button primary submit>
              Save Settings
            </Button>
          </FormLayout>
        </Form>
      </Layout>
    </Page>
  );
}

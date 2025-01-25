console.log("Setup button script loaded");

const BASE_URL = window.zoko_url;
const DOMAIN = window.shopify_domain;
const fetchDomainDetails = async () => {
  const res = await fetch(`${BASE_URL}?domain=${DOMAIN}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer NTRvcDFmNyNLZTc=",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch domain details");
  }
  return res.json();
};

const data = await fetchDomainDetails();
console.log(data);

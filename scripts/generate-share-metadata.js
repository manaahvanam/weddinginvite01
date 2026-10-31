const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const configPath = path.join(root, "invite-config.json");
const indexPath = path.join(root, "index.html");

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const localized = (value) => {
  if (!value || typeof value !== "object") return "";
  const language = config.language?.default === "sec" ? "sec" : "en";
  return value[language] ?? value.en ?? "";
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const metadata = config.metadata || {};
const preview = config.media_assets?.share_preview;
const title = localized(metadata.title);
const description = localized(metadata.description);
const siteUrl = metadata.site_url || "";
const imagePath =
  preview?.public_url ||
  (preview?.local_path && siteUrl
    ? new URL(preview.local_path, siteUrl).href
    : preview?.local_path || "");
const imageAlt = localized(preview?.alt_text);
const keywords = Array.isArray(metadata.keywords)
  ? metadata.keywords.join(", ")
  : "";

if (!siteUrl) {
  throw new Error("invite-config.json metadata.site_url is required");
}
if (!imagePath) {
  throw new Error("invite-config.json media_assets.share_preview is required");
}

const tags = [
  '<meta name="description" content="' + escapeHtml(description) + '" />',
  metadata.keywords
    ? '<meta name="keywords" content="' + escapeHtml(keywords) + '" />'
    : "",
  '<link rel="canonical" href="' + escapeHtml(siteUrl) + '" />',
  '<meta property="og:type" content="website" />',
  '<meta property="og:title" content="' + escapeHtml(title) + '" />',
  '<meta property="og:description" content="' + escapeHtml(description) + '" />',
  '<meta property="og:url" content="' + escapeHtml(siteUrl) + '" />',
  '<meta property="og:image" content="' + escapeHtml(imagePath) + '" />',
  '<meta property="og:image:secure_url" content="' + escapeHtml(imagePath) + '" />',
  '<meta property="og:image:width" content="' + escapeHtml(preview?.width || 2848) + '" />',
  '<meta property="og:image:height" content="' + escapeHtml(preview?.height || 1504) + '" />',
  '<meta property="og:image:alt" content="' + escapeHtml(imageAlt) + '" />',
  '<meta property="og:locale" content="' +
    (config.language?.default === "sec" ? "te_IN" : "en_IN") +
    '" />',
  '<meta property="og:locale:alternate" content="' +
    (config.language?.default === "sec" ? "en_IN" : "te_IN") +
    '" />',
  '<meta name="twitter:card" content="summary_large_image" />',
  '<meta name="twitter:title" content="' + escapeHtml(title) + '" />',
  '<meta name="twitter:description" content="' + escapeHtml(description) + '" />',
  '<meta name="twitter:image" content="' + escapeHtml(imagePath) + '" />',
  '<meta name="twitter:image:alt" content="' + escapeHtml(imageAlt) + '" />',
]
  .filter(Boolean)
  .join("\n    ");

let index = fs.readFileSync(indexPath, "utf8");
if (!index.includes("<!-- GENERATED_SHARE_METADATA -->")) {
  throw new Error("index.html is missing <!-- GENERATED_SHARE_METADATA --> marker");
}

index = index.replace("<!-- GENERATED_SHARE_METADATA -->", tags);
index = index.replace(/<title>[^<]*<\/title>/, "<title>" + escapeHtml(title) + "</title>");
fs.writeFileSync(indexPath, index, "utf8");
console.log("Generated share metadata from invite-config.json.");

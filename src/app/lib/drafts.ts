// Drafts: ideas that show only on preview addresses (pages.dev and localhost), never on
// musicbystripes.com.
export const isPreview = () => typeof location !== "undefined" && /(^|\.)pages\.dev$|^localhost$|^127\.0\.0\.1$/.test(location.hostname);

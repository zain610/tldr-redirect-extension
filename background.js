const TRACKING_PREFIX = "https://tracking.tldrnewsletter.com/CL0/";

/**
 * Removes the TLDR tracking prefix from the given URL.
 * Attempts to decode the remaining portion if it is percent-encoded.
 *
 * @param {string} url - The full tracking URL.
 * @returns {string|null} - The cleaned URL or null if no change is needed.
 */
function stripTrackingPrefix(url) {
  if (!url || !url.startsWith(TRACKING_PREFIX)) {
    return null;
  }

  const remainder = url.slice(TRACKING_PREFIX.length);
  if (!remainder) {
    return null;
  }

  try {
    // Handle cases where the destination URL is percent-encoded.
    return decodeURIComponent(remainder);
  } catch (error) {
    // If decoding fails, fall back to the raw remainder.
    return remainder;
  }
}

const webRequest =
  typeof browser !== "undefined" ? browser.webRequest : chrome.webRequest;

webRequest.onBeforeRequest.addListener(
  (details) => {
    const redirectUrl = stripTrackingPrefix(details.url);
    if (!redirectUrl) {
      return {};
    }

    return { redirectUrl };
  },
  { urls: ["*://tracking.tldrnewsletter.com/*"] },
  ["blocking"]
);


// Checks a license key. Set PROVIDER=lemonsqueezy or gumroad (plus GUMROAD_PRODUCT_ID), and/or MANUAL_KEYS="key1,key2"
// MANUAL_KEYS lets you sell by hand (e.g. JazzCash/Easypaisa/bank transfer) and send the buyer a key yourself.
module.exports = async function verify(key) {
  key = String(key || "").trim(); if (!key) return false;
  const manual = (process.env.MANUAL_KEYS || "").split(",").map(s => s.trim()).filter(Boolean);
  if (manual.includes(key)) return true;
  try {
    if (process.env.PROVIDER === "lemonsqueezy") {
      const r = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ license_key: key }) });
      return !!(await r.json()).valid;
    }
    if (process.env.PROVIDER === "gumroad") {
      const r = await fetch("https://api.gumroad.com/v2/licenses/verify", { method: "POST", body: new URLSearchParams({ product_id: process.env.GUMROAD_PRODUCT_ID, license_key: key }) });
      const j = await r.json(); return !!(j.success && j.purchase && !j.purchase.refunded && !j.purchase.chargebacked);
    }
  } catch (e) {}
  return false;
};

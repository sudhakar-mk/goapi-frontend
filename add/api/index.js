const fetch = require("node-fetch");

module.exports = async function (context, req) {
  try {
    const a = req.query.a || (req.body && req.body.a) || 0;
    const b = req.query.b || (req.body && req.body.b) || 0;

    // log for visibility
    context.log(`Proxy received a=${a} b=${b} from ${req.headers['x-forwarded-for'] || req.headers.origin}`);

    // call your container app (use the direct URL here)
    const target = `https://test2.whitelisland-5a5af531.centralindia.azurecontainerapps.io/api/add?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`;
    const resp = await fetch(target);
    const body = await resp.text();

    context.res = {
      status: resp.status,
      headers: { "Content-Type": resp.headers.get("content-type") || "application/json" },
      body: body
    };
  } catch (err) {
    context.log.error("Proxy error:", err);
    context.res = { status: 500, body: "proxy error" };
  }
};

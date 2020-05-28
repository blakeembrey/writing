import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import redirects from "./redirects.json";

const DEBUG = false;

const ASSET_OPTIONS = {
  cacheControl: {
    bypassCache: !DEBUG,
  },
};

addEventListener("fetch", (event) => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        })
      );
    }
    event.respondWith(new Response("Internal Error", { status: 500 }));
  }
});

async function handleEvent(event) {
  const url = new URL(event.request.url);
  let location = redirects[url.pathname];

  // Fallback on handling trailing slashes correctly.
  if (!location && url.pathname.endsWith("/")) {
    location = redirects[url.pathname.slice(0, -1)];
  }

  if (location) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: location,
      },
    });
  }

  try {
    return await getAssetFromKV(event, ASSET_OPTIONS);
  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          ...ASSET_OPTIONS,
          mapRequestToAsset: (req) =>
            new Request(`${new URL(req.url).origin}/404/index.html`, req),
        });

        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 404,
        });
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), { status: 500 });
  }
}

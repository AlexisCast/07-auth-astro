import { defineMiddleware } from "astro:middleware";

const privateRoutes = ["/protected"];

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async ({ url, request }, next) => {
  // console.log("🚀 ~ context:", url)

  const authHeaders = request.headers.get('authorization');
  console.log("🚀 ~ authHeaders:", authHeaders)

  if (privateRoutes.includes(url.pathname)) {

    if (authHeaders) {
      return next();
    }

    return new Response('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"'
      },
    });
  }


  return next();
});
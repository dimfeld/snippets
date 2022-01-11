import { ServerRequest } from '@sveltejs/kit/types/hooks';

/** Return true if this request doesn't present CSRF concerns. False if it appears to be
 * a CSRF or is from an old browser (IE11) that doesn't send the proper headers. */
function csrfCheck(request: ServerRequest): boolean {
  if (request.method === 'GET' || request.method === 'HEAD') {
    return true;
  }

  let origin = request.headers.origin || request.headers.referer;
  if (!origin || origin === 'null') {
    return false;
  }

  let originUrl = new URL(origin);
  return originUrl.origin === request.url.origin;
}


export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'access-control-allow-headers': 'Content-Type, Authorization',
        'access-control-max-age': '86400',
      },
    });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  let targetBase: string;
  let stripPrefix: string;

  if (path.startsWith('/api/freemodel')) {
    targetBase = 'https://api.freemodel.dev';
    stripPrefix = '/api/freemodel';
  } else if (path.startsWith('/api/openai')) {
    targetBase = 'https://api.openai.com';
    stripPrefix = '/api/openai';
  } else if (path.startsWith('/api/gemini')) {
    targetBase = 'https://generativelanguage.googleapis.com';
    stripPrefix = '/api/gemini';
  } else if (path.startsWith('/api/anthropic')) {
    targetBase = 'https://api.anthropic.com';
    stripPrefix = '/api/anthropic';
  } else {
    return new Response('Not found', { status: 404 });
  }

  const targetPath = path.replace(stripPrefix, '');
  const targetUrl = targetBase + targetPath + url.search;

  const proxyHeaders = new Headers();
  for (const [key, value] of request.headers.entries()) {
    if (!['host', 'connection', 'accept-encoding'].includes(key.toLowerCase())) {
      proxyHeaders.set(key, value);
    }
  }

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: proxyHeaders,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
  });

  const responseHeaders = new Headers();
  responseHeaders.set('access-control-allow-origin', '*');
  responseHeaders.set('cache-control', 'no-cache');

  const contentType = response.headers.get('content-type');
  if (contentType) {
    responseHeaders.set('content-type', contentType);
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export const config = {
  path: ['/api/freemodel/*', '/api/openai/*', '/api/gemini/*', '/api/anthropic/*'],
};

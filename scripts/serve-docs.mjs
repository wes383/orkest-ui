import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..', 'apps/docs/out');
const port = Number(process.env.PORT ?? 3100);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname.endsWith('/')) {
    const index = join(root, `${pathname}index.html`);

    if (existsSync(index)) {
      response.writeHead(200, { 'content-type': contentTypes['.html'] });
      createReadStream(index).pipe(response);
      return;
    }
  }

  const file = resolve(root, `.${pathname}`);

  if (file.startsWith(`${root}${sep}`) && existsSync(file) && statSync(file).isFile()) {
    response.writeHead(200, {
      'content-type': contentTypes[extname(file)] ?? 'application/octet-stream',
    });
    createReadStream(file).pipe(response);
    return;
  }

  // Next.js prefetches RSC payloads with dotted names, while the static export
  // stores them as nested directories. Map the fallback so prefetching does not
  // produce false 404s.
  if (pathname.endsWith('__PAGE__.txt')) {
    const marker = '__next.';
    const markerIndex = pathname.indexOf(marker);

    if (markerIndex !== -1) {
      const prefix = pathname.slice(0, markerIndex);
      const nested = pathname
        .slice(markerIndex + marker.length, -'__PAGE__.txt'.length)
        .split('.')
        .filter(Boolean)
        .join(sep);
      const rscFile = resolve(root, `.${prefix}${marker}${nested}${sep}__PAGE__.txt`);

      if (rscFile.startsWith(`${root}${sep}`) && existsSync(rscFile)) {
        response.writeHead(200, { 'content-type': contentTypes['.txt'] });
        createReadStream(rscFile).pipe(response);
        return;
      }
    }
  }

  const notFound = join(root, '404.html');
  response.writeHead(404, {
    'content-type': existsSync(notFound) ? contentTypes['.html'] : 'text/plain; charset=utf-8',
  });

  if (existsSync(notFound)) {
    createReadStream(notFound).pipe(response);
  } else {
    response.end('Not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Docs served at http://127.0.0.1:${port}`);
});

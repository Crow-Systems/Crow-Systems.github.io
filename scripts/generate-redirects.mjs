import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// ponytail: paths are identical across hosts, mapping is identity.
const ROUTES = [
  '/', '/en/', '/consultoria/', '/contacto/', '/en/about/', '/en/consulting/',
  '/en/contact/', '/en/flyer/', '/en/flyer/corporate/', '/en/privacy/',
  '/en/services/', '/en/terms/', '/folleto/', '/folleto/corporate/',
  '/nosotros/', '/privacidad/', '/servicios/', '/terminos/',
];

const TARGET = 'https://crowsystems.com.mx';
const VERIFICATION = 'e0CYivTL-sbhZAX7g7aUGMI6tPHKgqCS3SF73fKU4No';

const dist = join(process.cwd(), 'dist');
rmSync(dist, { recursive: true, force: true });

const page = (url) => `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${url}">
<link rel="canonical" href="${url}">
<meta name="google-site-verification" content="${VERIFICATION}">
<title>Moved — CROW SYSTEMS</title>
</head>
<body>
<p>This page moved to <a href="${url}">${url}</a>. You will be redirected automatically.</p>
</body>
</html>
`;

for (const route of ROUTES) {
  const out = join(dist, route, 'index.html');
  mkdirSync(join(dist, route), { recursive: true });
  writeFileSync(out, page(TARGET + route));
}

writeFileSync(join(dist, '404.html'), page(TARGET + '/'));
writeFileSync(join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\n');

const expected = ROUTES.length + 2;
let count = 0;
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) walk(join(dir, entry.name));
    else count++;
  }
};
walk(dist);
if (count !== expected) {
  console.error(`generate-redirects: expected ${expected} files, got ${count}`);
  process.exit(1);
}
console.log(`generate-redirects: ${count} files written to dist/`);
import { existsSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');

if (!existsSync(join(dist, 'sitemap-0.xml'))) {
  console.log('sitemap-flatten: no sitemap-0.xml found, skipping');
  process.exit(0);
}

renameSync(join(dist, 'sitemap-0.xml'), join(dist, 'sitemap.xml'));

for (const name of readdirSync(dist)) {
  if (name === 'sitemap.xml') continue;
  // ponytail: drops chunks 1+ silently; site is ~20 pages, revisit if >45000 URLs
  if (/^sitemap-\d+\.xml$/.test(name) || name === 'sitemap-index.xml') {
    rmSync(join(dist, name));
  }
}

console.log('sitemap-flatten: dist/sitemap.xml written');
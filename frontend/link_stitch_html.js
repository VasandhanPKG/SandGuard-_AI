import fs from 'fs';
import path from 'path';

const htmlDir = path.resolve('public/stitch_html');
const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(htmlDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove old navScript blocks if present
  content = content.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded', \(\) => {[\s\S]*?<\/script>/gi, '');
  
  // Ensure stitch_app.js script tag is present
  const appScriptTag = '<script src="/stitch_app.js"></script>';
  if (!content.includes('src="/stitch_app.js"')) {
    content = content.replace('</body>', `  ${appScriptTag}\n</body>`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[LINKED & POWERED] Embedded stitch_app.js into ${file}`);
});

console.log('Successfully interconnected and injected interactivity into all 11 Stitch HTML files!');

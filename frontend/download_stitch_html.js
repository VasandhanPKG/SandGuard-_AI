import fs from 'fs';
import path from 'path';
import https from 'https';

const stitchUrls = [
  { name: '01_login.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2ViYjYxODAzNWFjZDQzMzRiYzc1ZWUxOTZhZTNlZjQzEgsSBxDPrZLB-h0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNTA1MjI4MzYzNTk1MjE2NTU4Mg&filename=&opi=96797242' },
  { name: '02_command_center_dashboard.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2VhMzdlNGIxNWVmZDQ4ODlhNTQ5OTUwMjg1ZjQ5YTEwEgsSBxDPrZLB-h0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNTA1MjI4MzYzNTk1MjE2NTU4Mg&filename=&opi=96797242' },
  { name: '03_gis_monitoring.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2YxN2ZlZTQ5ZDFmNzQzNzY5MTM1NWVlNWM5ODhhNDA1EgsSBxDPrZLB-h0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNTA1MjI4MzYzNTk1MjE2NTU4Mg&filename=&opi=96797242' },
  { name: '04_satellite_intelligence.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2E0ODAwYzQwMWMwZjRmM2U5NjgzNzQxZWY5OGE0NWIyEgsSBxDPrZLB-h0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNTA1MjI4MzYzNTk1MjE2NTU4Mg&filename=&opi=96797242' },
  { name: '05_drone_verification.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2NhYjA5MjZmN2Y2ZjRlNjU5ZjRhNmE4ZjA0YjQxOWVjEgsSBxDPrZLB-h0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNTA1MjI4MzYzNTk1MjE2NTU4Mg&filename=&opi=96797242' },
  { name: '06_vehicle_analytics.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzVlYmU2Mzc2OWRlNTQxNzc4YzQ5NGI1NGEzNDgyZTlkEgsSBxDPrZLB-h0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNTA1MjI4MzYzNTk1MjE2NTU4Mg&filename=&opi=96797242' },
  { name: '07_ai_prediction.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzU4MjgxNGU0ZmYyOTQwN2Q4YmRjYzI2ZTViMmUyMzFhEgsSBxDPrZLB-h0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNTA1MjI4MzYzNTk1MjE2NTU4Mg&filename=&opi=96797242' },
  { name: '08_ai_explainability.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzlmZTVhZmRlNDI0ODRkZTc4NzUxM2RhMjE2NzY1MTQwEgsSBxDPrZLB-h0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNTA1MjI4MzYzNTk1MjE2NTU4Mg&filename=&opi=96797242' },
  { name: '09_alert_management.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2U1YTM4OGFjNjFlZjQ3YTQ5YmE4MDMzMDI1NGQ4NDA0EgsSBxDPrZLB-h0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNTA1MjI4MzYzNTk1MjE2NTU4Mg&filename=&opi=96797242' },
  { name: '10_report_generation.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzQ4MmNkNDFlMmFjOTQwNDVhNzdkNTQzMzcxNGQ1MjUzEgsSBxDPrZLB-h0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNTA1MjI4MzYzNTk1MjE2NTU4Mg&filename=&opi=96797242' },
  { name: '11_mobile_field_officer.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzkwYTJmYzQ3MWZhYjQ4ZmNhZTUwOTUxYTQ5MDVkNWEwEgsSBxDPrZLB-h0YAZIBJAoKcHJvamVjdF9pZBIWQhQxNTA1MjI4MzYzNTk1MjE2NTU4Mg&filename=&opi=96797242' }
];

const outDir = path.resolve('public/stitch_html');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Downloading Stitch HTML files into:', outDir);

const fetchUrl = (item) => {
  return new Promise((resolve, reject) => {
    const dest = path.join(outDir, item.name);
    const file = fs.createWriteStream(dest);
    https.get(item.url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`[SUCCESS] Saved ${item.name}`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      console.error(`[ERROR] ${item.name}:`, err.message);
      resolve();
    });
  });
};

async function downloadAll() {
  for (const item of stitchUrls) {
    await fetchUrl(item);
  }
  console.log('All Stitch HTML downloads finished!');
}

downloadAll();

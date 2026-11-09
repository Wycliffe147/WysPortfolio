import fs from 'fs';
import path from 'path';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const dirPath = path.join(process.cwd(), 'assets', 'hero-bg');

  let files = [];
  try {
    files = fs.readdirSync(dirPath);
  } catch (err) {
    // Folder missing entirely — treat the same as "no images"
    return res.status(200).json({ images: [] });
  }

  const images = files
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort()
    .map((file) => `assets/hero-bg/${file}`);

  return res.status(200).json({ images });
}

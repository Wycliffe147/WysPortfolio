#!/usr/bin/env node
/**
 * make-bundle.mjs - WysPortfolio Claude.ai Context Bundle Generator
 *
 * Produces:
 *   1. wyport-bundle.zip  -> ZIP archive of core codebase for Claude.ai Project knowledge
 *   2. wyport-bundle.txt  -> Single structured text file ready to upload directly into chat
 *
 * Run with:
 *   npm run bundle              (working tree)
 *   npm run bundle:staging      (git branch: staging)
 *   npm run bundle:main         (git branch: main)
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = __dirname;

const FILES = [
  // Docs & config
  'README.md',
  'REMINDERS.md',
  'package.json',
  'next.config.ts',
  'tsconfig.json',
  'tailwind.config.js',
  'postcss.config.js',
  'eslint.config.mjs',

  // App shell & routing
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/globals.css',

  // Pages
  'src/app/projects/page.tsx',
  'src/app/journey/page.tsx',
  'src/app/admin/page.tsx',

  // API routes
  'src/app/api/auth/route.ts',

  // Components
  'src/components/GithubIcon.tsx',

  // Data & lib
  'src/data/portfolioData.ts',
  'src/lib/firebase.ts',
  'src/lib/projectUtils.ts',
];

const SKIP = new Set([
  'package-lock.json',
]);

function getFileContent(rel, branch) {
  if (branch) {
    try {
      return execSync(`git show ${branch}:${rel}`, {
        cwd: root,
        stdio: ['pipe', 'pipe', 'ignore'],
      }).toString('utf8');
    } catch {
      return null;
    }
  }
  const fullPath = path.join(root, rel);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf8');
}

function buildTextBundle(fileList, outFileName, branch) {
  const SEP = '='.repeat(80);
  let out = '';
  let totalBytes = 0;
  let includedCount = 0;
  let skippedCount = 0;

  out += `${SEP}\n`;
  out += `  WYCLIFFE'S PORTFOLIO (WYPORT) - CODEBASE CONTEXT BUNDLE\n`;
  out += `  Generated: ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Blantyre' })} CAT\n`;
  out += `  Source   : ${branch ? `Branch: ${branch}` : 'Current Working Tree'}\n`;
  out += `  Purpose  : Claude.ai Context / Architecture Review\n`;
  out += `  Stack    : Next.js 15, React 19, TypeScript, Tailwind CSS, Firebase\n`;
  out += `  Live URL : https://wyport.vercel.app\n`;
  out += `${SEP}\n\n`;

  out += `TABLE OF CONTENTS\n`;
  out += '-'.repeat(40) + '\n';
  fileList.forEach((rel, i) => {
    const content = getFileContent(rel, branch);
    out += `  ${String(i + 1).padStart(2, ' ')}. ${rel}${content !== null ? '' : '  [NOT FOUND - SKIPPED]'}\n`;
  });
  out += '\n' + SEP + '\n\n';

  for (const rel of fileList) {
    if (SKIP.has(path.basename(rel))) {
      skippedCount++;
      continue;
    }
    const content = getFileContent(rel, branch);
    if (content === null) {
      skippedCount++;
      continue;
    }

    const lines = content.split('\n').length;
    const bytes = Buffer.byteLength(content, 'utf8');

    out += `${SEP}\n`;
    out += `FILE: ${rel}\n`;
    out += `SIZE: ${(bytes / 1024).toFixed(1)} KB  |  LINES: ${lines}\n`;
    out += `${SEP}\n`;
    out += content;
    if (!content.endsWith('\n')) out += '\n';
    out += '\n';

    totalBytes += bytes;
    includedCount++;
  }

  out += `${SEP}\n`;
  out += `END OF WYPORT BUNDLE\n`;
  out += `Files included : ${includedCount}\n`;
  out += `Files skipped  : ${skippedCount}\n`;
  out += `Total source   : ${(totalBytes / 1024).toFixed(1)} KB\n`;
  const bundleKB = (Buffer.byteLength(out, 'utf8') / 1024).toFixed(1);
  out += `Bundle size    : ${bundleKB} KB\n`;
  out += `${SEP}\n`;

  const outFile = path.join(root, outFileName);
  fs.writeFileSync(outFile, out, 'utf8');
  return { outFileName, bundleKB, includedCount };
}

function buildZipBundle(fileList, outZipName, branch) {
  const outPath = path.join(root, outZipName);
  if (fs.existsSync(outPath)) fs.unlinkSync(outPath);

  if (branch) {
    const existing = fileList.filter(rel => {
      try {
        execSync(`git cat-file -e ${branch}:${rel}`, {
          cwd: root,
          stdio: ['pipe', 'pipe', 'ignore'],
        });
        return !SKIP.has(path.basename(rel));
      } catch {
        return false;
      }
    });
    execSync(
      `git archive ${branch} ${existing.map(f => `"${f}"`).join(' ')} -o "${outPath}"`,
      { cwd: root }
    );
    const stat = fs.statSync(outPath);
    return { outFileName: outZipName, zipKB: (stat.size / 1024).toFixed(1), totalFiles: existing.length };
  }

  const existingFiles = fileList.filter(
    rel => fs.existsSync(path.join(root, rel)) && !SKIP.has(path.basename(rel))
  );
  execSync(`zip -q "${outPath}" ${existingFiles.map(f => `"${f}"`).join(' ')}`, { cwd: root });
  const stat = fs.statSync(outPath);
  return { outFileName: outZipName, zipKB: (stat.size / 1024).toFixed(1), totalFiles: existingFiles.length };
}

async function run() {
  const args = process.argv.slice(2);
  let branch = null;
  if (args.includes('staging') || args.includes('--staging')) branch = 'staging';
  else if (args.includes('main') || args.includes('--main')) branch = 'main';

  const sourceDesc = branch ? `branch "${branch}"` : 'current working tree';
  console.log(`Generating WysPortfolio bundle from ${sourceDesc} for Claude.ai...\n`);

  const zipRes = buildZipBundle(FILES, 'wyport-bundle.zip', branch);
  console.log(`  ${zipRes.outFileName.padEnd(24)} | ${zipRes.zipKB.padStart(6)} KB | ${zipRes.totalFiles} files (ZIP archive - recommended!)`);

  const txtRes = buildTextBundle(FILES, 'wyport-bundle.txt', branch);
  console.log(`  ${txtRes.outFileName.padEnd(24)} | ${txtRes.bundleKB.padStart(6)} KB | ${txtRes.includedCount} files (Single text bundle)`);

  console.log('\nReady to upload:');
  console.log(`   1. ZIP : ${path.join(root, 'wyport-bundle.zip')}`);
  console.log(`   2. TXT : ${path.join(root, 'wyport-bundle.txt')}\n`);
}

run().catch(console.error);

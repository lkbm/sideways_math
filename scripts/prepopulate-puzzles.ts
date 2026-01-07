#!/usr/bin/env npx tsx
/**
 * Pre-populate KV cache with puzzles
 *
 * Usage:
 *   npx tsx scripts/prepopulate-puzzles.ts [--from N] [--to N] [--difficulties easy,medium,hard]
 *
 * Examples:
 *   npx tsx scripts/prepopulate-puzzles.ts                    # Puzzles 1-1000, all difficulties
 *   npx tsx scripts/prepopulate-puzzles.ts --from 1 --to 100  # Puzzles 1-100
 *   npx tsx scripts/prepopulate-puzzles.ts --difficulties medium,hard  # Only medium and hard
 */

import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { generatePuzzleForSeed } from '../src/shared/puzzleGenerator';
import type { Difficulty } from '../src/types';

const KV_NAMESPACE_ID = '04b53826bc2a4ed7a94ce0d5905a6676';
const BATCH_SIZE = 100; // KV bulk put limit is 10,000 pairs, but we'll batch smaller

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  let from = 1;
  let to = 1000;
  let difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--from' && args[i + 1]) {
      from = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--to' && args[i + 1]) {
      to = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--difficulties' && args[i + 1]) {
      difficulties = args[i + 1].split(',') as Difficulty[];
      i++;
    }
  }

  return { from, to, difficulties };
}

interface KVPair {
  key: string;
  value: string;
}

async function uploadBatch(pairs: KVPair[], batchNum: number, totalBatches: number) {
  const tempFile = `/tmp/kv-batch-${Date.now()}.json`;

  try {
    writeFileSync(tempFile, JSON.stringify(pairs));
    execSync(
      `npx wrangler kv bulk put "${tempFile}" --namespace-id=${KV_NAMESPACE_ID}`,
      { stdio: 'pipe' }
    );
    console.log(`Batch ${batchNum}/${totalBatches} uploaded (${pairs.length} puzzles)`);
  } finally {
    try {
      unlinkSync(tempFile);
    } catch {
      // Ignore cleanup errors
    }
  }
}

async function main() {
  const { from, to, difficulties } = parseArgs();
  const total = (to - from + 1) * difficulties.length;

  console.log(`Generating puzzles ${from}-${to} for difficulties: ${difficulties.join(', ')}`);
  console.log(`Total puzzles to generate: ${total}\n`);

  const allPairs: KVPair[] = [];
  let generated = 0;

  // Generate all puzzles first
  for (const difficulty of difficulties) {
    for (let puzzleNumber = from; puzzleNumber <= to; puzzleNumber++) {
      const key = `puzzle:${difficulty}:${puzzleNumber}`;
      const puzzle = generatePuzzleForSeed(puzzleNumber, difficulty);

      allPairs.push({
        key,
        value: JSON.stringify(puzzle)
      });

      generated++;
      if (generated % 100 === 0) {
        const pct = ((generated / total) * 100).toFixed(1);
        process.stdout.write(`\rGenerating: ${generated}/${total} (${pct}%)`);
      }
    }
  }

  console.log(`\nGenerated ${allPairs.length} puzzles. Uploading to KV...\n`);

  // Upload in batches
  const totalBatches = Math.ceil(allPairs.length / BATCH_SIZE);
  for (let i = 0; i < allPairs.length; i += BATCH_SIZE) {
    const batch = allPairs.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    await uploadBatch(batch, batchNum, totalBatches);
  }

  console.log(`\nDone! Uploaded ${allPairs.length} puzzles to KV.`);
}

main().catch(console.error);

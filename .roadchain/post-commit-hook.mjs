#!/usr/bin/env node

/**
 * RoadChain Post-Commit Hook
 * Generates SHA-256 hash for commits and records to RoadChain
 */

import crypto from 'crypto';
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const ROADCHAIN_DIR = '.roadchain';
const COMMITS_DIR = path.join(ROADCHAIN_DIR, 'commits');
const AUDIT_LOG = path.join(ROADCHAIN_DIR, 'audit.log');

function ensureDirectories() {
  if (!fs.existsSync(ROADCHAIN_DIR)) {
    fs.mkdirSync(ROADCHAIN_DIR, { recursive: true });
  }
  if (!fs.existsSync(COMMITS_DIR)) {
    fs.mkdirSync(COMMITS_DIR, { recursive: true });
  }
}

function getCommitInfo() {
  const hash = execSync('git rev-parse HEAD').toString().trim();
  const author = execSync('git log -1 --format=%an').toString().trim();
  const email = execSync('git log -1 --format=%ae').toString().trim();
  const timestamp = execSync('git log -1 --format=%aI').toString().trim();
  const message = execSync('git log -1 --format=%s').toString().trim();
  const parent = execSync('git rev-parse HEAD~1 2>/dev/null || echo "INITIAL"').toString().trim();
  
  return { hash, author, email, timestamp, message, parent };
}

function generateRoadChainHash(commitInfo) {
  const data = JSON.stringify({
    gitHash: commitInfo.hash,
    author: commitInfo.author,
    email: commitInfo.email,
    timestamp: commitInfo.timestamp,
    message: commitInfo.message,
    parent: commitInfo.parent,
    roadchainVersion: '1.0.0'
  });
  
  return crypto.createHash('sha256').update(data).digest('hex');
}

function recordToChain(commitInfo, roadchainHash) {
  const record = {
    roadchainHash,
    gitHash: commitInfo.hash,
    author: commitInfo.author,
    email: commitInfo.email,
    timestamp: commitInfo.timestamp,
    message: commitInfo.message,
    parent: commitInfo.parent,
    recordedAt: new Date().toISOString()
  };
  
  // Save individual commit record
  const commitFile = path.join(COMMITS_DIR, `${roadchainHash}.json`);
  fs.writeFileSync(commitFile, JSON.stringify(record, null, 2));
  
  // Append to audit log
  const logEntry = `${record.recordedAt} | ${roadchainHash} | ${commitInfo.hash} | ${commitInfo.author} | ${commitInfo.message}\n`;
  fs.appendFileSync(AUDIT_LOG, logEntry);
  
  console.log(`✅ RoadChain: Commit tracked with SHA-256: ${roadchainHash.substring(0, 12)}...`);
}

function main() {
  try {
    ensureDirectories();
    const commitInfo = getCommitInfo();
    const roadchainHash = generateRoadChainHash(commitInfo);
    recordToChain(commitInfo, roadchainHash);
  } catch (error) {
    console.error('⚠️  RoadChain tracking failed:', error.message);
    // Don't fail the commit if RoadChain tracking fails
    process.exit(0);
  }
}

main();

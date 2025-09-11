// src/utils/getEnvVar.js

import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

export function getEnvVar(name, defaultValue) {
  const value = process.env[name];

  if (value) return value;

  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${name}'].`);
}

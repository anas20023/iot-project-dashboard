import "server-only";

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  return `${salt}:${Buffer.from(derivedKey).toString("hex")}`;
}

export async function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  const storedKey = Buffer.from(hash, "hex");
  const suppliedKey = Buffer.from(derivedKey);

  return storedKey.length === suppliedKey.length && timingSafeEqual(storedKey, suppliedKey);
}

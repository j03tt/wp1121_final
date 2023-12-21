import { faker } from "@faker-js/faker";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// this utility function is used to merge tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// generate a random avatar for a user
export function getAvatar(username?: string | null) {
  faker.seed(username ? getSeed(username) : 42069);
  return faker.internet.avatar();
}

// convert username to a number for consistent seeding
function getSeed(username: string) {
  const code = new TextEncoder().encode(username);
  return Array.from(code).reduce(
    (acc, curr, i) => (acc + curr * i) % 1_000_000,
    0,
  );
}

export function validateHandle(handle?: string | null) {
  if (!handle) return false;
  return /^[a-z0-9\\._-]{1,25}$/.test(handle);
}

export function validateUsername(username?: string | null) {
  if (!username) return false;
  return /^[a-zA-Z0-9 ]{1,50}$/.test(username);
}
export function validateTimeFormat(time?: string | null) {
  if (!time) return false;
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}$/;
  return dateTimeRegex.test(time);
}

export function validateTime(time?: string | null) {
  if (!time) return false;
  const date = new Date(time);
  
  return isNaN(date.getTime());
}

export function validateTimeDiff(time1?: string | null, time2?: string | null) {
  if (!time1) return false;
  if(!time2)  return false;
  const date1 = new Date(time1);
  const date2 = new Date(time2);
  
  const timeDifference = date2.getTime() - date1.getTime();
  
  const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  
  if(timeDifference <= oneWeekInMilliseconds && timeDifference > 0)
    return true;
  else
    return false;
}

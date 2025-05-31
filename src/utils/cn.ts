import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single class string, using clsx for conditional classes
 * and tailwind-merge to handle conflicting Tailwind classes.
 * 
 * @param inputs Class values to be combined
 * @returns A single merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 
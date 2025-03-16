import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string) {
  return Number(value).toLocaleString("vi-VN");
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("vi-VN");
}

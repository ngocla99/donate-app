import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string) {
  return Number(value).toLocaleString("vi-VN");
}

export function formatDate(date: Date | number | string) {
  return format(date, "dd/MM/yyyy");
}

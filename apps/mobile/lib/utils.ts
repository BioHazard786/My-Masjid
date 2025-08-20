import { clsx, type ClassValue } from "clsx";
import { MMKV } from "react-native-mmkv";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

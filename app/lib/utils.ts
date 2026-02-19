import { type ClassValue, clsx } from "clsx"
import type { Hash } from "viem"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CJK_NUMERALS = ["一", "二", "三", "四", "五", "六", "七", "八", "九"]

/** Returns the Chinese numeral for a given number (1-based, wraps at 9) */
export const toChinaNumeral = (n: number) =>
  CJK_NUMERALS[(((n - 1) % 9) + 9) % 9]

/** Appends Minikit resulting signature placeholder */
export const appendSignatureResult = (opts?: { slot: number }) =>
  `PERMIT2_SIGNATURE_PLACEHOLDER_${opts?.slot || 0}` as Hash

export const generateUUID = () => crypto.randomUUID().replace(/-/g, "")

export const beautifyAddress = (addr: string, size = 4, separator = "...") =>
  `${addr.substr(0, size)}${separator}${addr.substr(-size, size)}`

export const jsonify = <T>(response: Response | Promise<Response>) => {
  return response instanceof Response
    ? (response.json() as Promise<T>)
    : response.then((r) => r.json() as Promise<T>)
}

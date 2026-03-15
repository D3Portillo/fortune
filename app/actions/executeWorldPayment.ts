import type { Hash } from "viem"

import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js"
import { generateUUID } from "@/lib/utils"

export const PRO_PAYMENT_RECIPIENT =
  "0xdDaE1E19978FF612C52bDF72Ffd4673f80a17533"

export const executeWorldPayment = async ({
  paymentDescription,
  amount,
  token,
}: {
  paymentDescription: string
  amount: number
  token: "WLD" | "USDC"
}) => {
  if (!MiniKit.isInstalled()) return null

  const uuid = generateUUID()
  const paymentToken = token === "WLD" ? Tokens.WLD : Tokens.USDC

  const payload: PayCommandInput = {
    reference: uuid,
    to: PRO_PAYMENT_RECIPIENT,
    tokens: [
      {
        symbol: paymentToken,
        token_amount: tokenToDecimals(amount, paymentToken).toString(),
      },
    ],
    description: paymentDescription,
  }

  const { finalPayload } = await MiniKit.commandsAsync.pay(payload)
  if (finalPayload.status == "success") {
    return finalPayload.transaction_id as Hash
  }

  return null
}

import { toHex, type Address } from "viem"
import { cn } from "@/lib/utils"

interface AddressBlockProps {
  address?: Address
  className?: string
}

const DEFAULT_ADDRESS = toHex("DEFAULT")

export default function AddressBlock({
  address,
  className,
}: AddressBlockProps) {
  return (
    <figure
      style={{
        backgroundImage: addressToGradient(address || DEFAULT_ADDRESS),
      }}
      className={cn("size-full", className)}
    />
  )
}

function addressToGradient(address: Address) {
  // Use different parts of the address to generate two hue values
  const hash1 = parseInt(address.slice(2, 10), 16)
  const hash2 = parseInt(address.slice(-8), 16)

  // Generate two HSL colors based on the hashes
  const from = `hsl(${hash1 % 360}, 70%, 50%)`
  const to = `hsl(${hash2 % 360}, 70%, 50%)`

  return `
  radial-gradient(circle at 66% 33%, rgba(255, 255, 255, 0.33), transparent 77%),
  linear-gradient(to bottom right, ${from}, ${to})`
}

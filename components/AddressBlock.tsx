import { Facehash, type FacehashProps } from "facehash"

export default function AddressBlock({
  name = "W",
  ...props
}: Partial<FacehashProps>) {
  return (
    <Facehash
      colors={["#000"]}
      enableBlink
      size="100%"
      name={name}
      {...props}
    />
  )
}

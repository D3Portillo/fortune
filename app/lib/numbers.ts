const Formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "code",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export const localizeNumber = (value?: number | string) => {
  return Formatter.format(Number(value || 0))
    .replace("USD", "")
    .trim()
}

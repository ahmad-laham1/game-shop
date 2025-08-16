export function formatPrice(value, location) {
  if (value == null) return "";
  const num = typeof value === "number" ? value : Number(value); // if the value is a string or other type, convert it to a number

  // Map product location → currency code
  const currency =
    location === "JO" ? "JOD" : location === "SA" ? "SAR" : "USD"; // if location is not recognized, default to USD

  // Pick a locale that renders nicely for each region
  const locale =
    location === "JO" ? "en-JO" : location === "SA" ? "en-SA" : "en";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(num);
}

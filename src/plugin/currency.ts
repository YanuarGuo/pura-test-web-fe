function intToRupiah(nominal: number) {
  let formatedNominal = Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(nominal)
    .replace("Rp", "Rp. ");
  return formatedNominal;
}

function rupiahToInt(nominal: string | undefined | null): number {
  if (!nominal) {
    return 0; // Return 0 or handle appropriately
  }

  // Remove "Rp. ", ".", and spaces
  const cleanedStr = nominal.replace(/[Rp.\s]/g, "");

  // Convert to a number
  const number = parseInt(cleanedStr, 10);

  return isNaN(number) ? 0 : number; // Handle invalid number conversions
}

export default {
  intToRupiah,
  rupiahToInt,
};

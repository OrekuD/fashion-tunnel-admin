const formatNumber = (number: number) =>
  Number(number).toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default formatNumber;

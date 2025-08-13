function generateSku() {
  const prefix = "PROD";
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomNumber}`;
}

export default generateSku;

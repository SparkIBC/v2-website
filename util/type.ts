export function truncateAddress(address: string, visibleFirst: number = 8, visibleLast: number = 4) {
  return `${address.substring(0, visibleFirst)}...${address.substring(address.length - visibleLast, address.length)}`;
}

export function convertMicroDenomToDenom(amount: number | string) {
  if (typeof amount === 'string') {
    amount = Number(amount);
  }
  amount = amount / 1000000;
  return isNaN(amount) ? 0 : amount;
}

export function isValidAddress(address: string) {
  const minLength = 25;
  const maxLength = 34;

  if (address.length >= minLength && address.length <= maxLength) {
    if (address.startsWith("1")) {
      return true;
    }
  }

  return false;
}
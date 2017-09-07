export function isValidAddress(address: string) {
  // Infos on validation : https://thomas.vanhoutte.be/tools/validate-bitcoin-address.php

  const minLength = 25;
  const maxLength = 34;

  if (address.length >= minLength && address.length <= maxLength) {
    if (address.startsWith("1")) {
      return true;
    }
  }

  return false;
}
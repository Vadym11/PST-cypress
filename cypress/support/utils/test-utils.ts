import fs from 'fs';
import path from 'path';
/**
 * Generates random user data for registration.
 * User data is sourced from predefined arrays in registerUserData.json.
 * @returns A User object with random data.
 */
export function generateRandomUserData(userData) {
//   const dataFilePath = path.join(process.cwd(), './cypress/support/data/user-data.json');
// //   fs.readFile
//   const userData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  const randomNumber = getRandomIntInclusive(0, 9999);

  const FIRST_NAME = getRandomArrayElement(userData.firstNames);
  const LAST_NAME = getRandomArrayElement(userData.lastNames);
  const DOB = getRandomArrayElement(userData.dob);
  const STREET = getRandomArrayElement(userData.streets);
  const POSTCODE = getRandomArrayElement(userData.postcodes);
  const CITY = getRandomArrayElement(userData.cities);
  const STATE = getRandomArrayElement(userData.states);
  const COUNTRY = getRandomArrayElement(userData.countries);
  const PHONE = getRandomArrayElement(userData.phones);
  const EMAIL = `${FIRST_NAME}.${LAST_NAME}${randomNumber}@gmail.com`;
  const PASSWORD = `${FIRST_NAME}.${LAST_NAME}**12345$%`;

  return {
    first_name: FIRST_NAME,
    last_name: LAST_NAME,
    address: {
      street: STREET,
      postal_code: POSTCODE,
      city: CITY,
      state: STATE,
      country: COUNTRY,
    },
    dob: DOB,
    phone: PHONE,
    email: EMAIL.toLowerCase(),
    password: PASSWORD,
  };
}

/**
 * Generates a random integer between min (inclusive) and max (inclusive).
 * @param min The minimum possible value.
 * @param max The maximum possible value.
 * @returns A random integer.
 */
export function getRandomIntInclusive(min: number, max: number): number {
  // Ensure inputs are treated as integers for correct range calculation
  const minCeiled: number = Math.ceil(min);
  const maxFloored: number = Math.floor(max);

  // The maximum is inclusive and the minimum is inclusive
  // Math.random() generates a number from [0, 1). Multiplying ensures it covers the whole range.
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

/**
 * Returns a random element from an array.
 * @param array The array to select an element from.
 * @returns A random element from the array.
 */
export function getRandomArrayElement(array: any[]) {
  return array[getRandomIntInclusive(0, array.length - 1)];
}
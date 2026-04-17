import { CreateUser } from '../types/user';
import { ProductRequest } from '../types/product';
import { faker } from '@faker-js/faker';
import countries from '../../support/data/countries.json';
import users from '../../support/data/user-data.json'
import { urls } from './project-utils';

/**
 * Generates random user data for registration.
 * User data is sourced from predefined arrays in registerUserData.json.
 * @returns A User object with random data.
 */
export function generateRandomUserData(): CreateUser {
  const randomNumber = getRandomIntInclusive(0, 9999);

  const FIRST_NAME = getRandomArrayElement(users.firstNames);
  const LAST_NAME = getRandomArrayElement(users.lastNames);
  const DOB = getRandomArrayElement(users.dob);
  const STREET = getRandomArrayElement(users.streets);
  const POSTCODE = getRandomArrayElement(users.postcodes);
  const CITY = getRandomArrayElement(users.cities);
  const STATE = getRandomArrayElement(users.states);
  const COUNTRY = getRandomArrayElement(users.countries);
  const PHONE = getRandomArrayElement(users.phones);
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
  
/**
 * Generates randomly generated user data using Faker.js.
 * @returns randomly generated user data of CreateUser type.
 */
export function generateRandomUserDataFaker(): CreateUser {
  // const dataFilePath = path.join(process.cwd(), './cypress/support/data/countries.json');
  // const countries = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

  const FIRST_NAME = faker.person.firstName().replaceAll("'", '');
  const LAST_NAME = faker.person.lastName().replaceAll("'", '');
  const DOB = faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0];
  const STREET = faker.location.streetAddress().substring(0, 100); // Max length 100 chars
  const POSTCODE = faker.location.zipCode();
  const CITY = faker.location.city();
  const STATE = faker.location.state();
  const COUNTRY = getRandomArrayElement(countries);
  const PHONE = faker.phone.number({style: 'international'}).replaceAll('+', '');
  const EMAIL = `${FIRST_NAME}.${LAST_NAME}${DOB.substring(0, 4)}@gmail.com`;
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

export function getToken(email: string, password: string): Cypress.Chainable<string> {
  return cy.request({
    method: 'POST',
    url: `${urls.apiUrl}/users/login`,
    body: { email: email, password: password }
  }).then((res) => {
    return res.body.access_token;
  });
}

export function generateRandomProductDataFaker(relatedIds: {
  categoryId: string;
  brandId: string;
  productImageId: string;
}): ProductRequest {
  const NAME = `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} Tool ${Date.now()}`;
  const DESCRIPTION = faker.commerce.productDescription().substring(0, 240);

  return {
    name: NAME,
    description: DESCRIPTION,
    price: Number(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
    category_id: relatedIds.categoryId,
    brand_id: relatedIds.brandId,
    product_image_id: relatedIds.productImageId,
    is_location_offer: faker.datatype.boolean(),
    is_rental: faker.datatype.boolean(),
    co2_rating: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']),
  };
}

import { faker } from "@faker-js/faker";
import { fail } from "assert";

export function randomItemFromArray(array: string[]) {
  if (array.length === 0) {
    fail("Array expected to have at least one item");
  }

  return array[faker.mersenne.rand(array.length - 1, 0)];
}

export function randomBoolean() {
  return Math.random() < 0.5;
}

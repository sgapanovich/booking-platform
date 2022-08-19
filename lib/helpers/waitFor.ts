// function to wait for certain amount of milliseconds

export async function waitFor(milliseconds = 100) {
  await new Promise((r) => setTimeout(r, milliseconds));
}
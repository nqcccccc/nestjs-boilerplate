if (process.env.NODE_ENV !== 'DEV' || process.env.CI === 'true') {
  process.exit(0)
}
const husky = (await import('husky')).default
console.log(husky())
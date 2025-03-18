// LOGGERS
export function info(info, name) {
  console.info(name ? `\nℹ️ ${name}:` : `\nℹ️`);
  console.log(info);
}
export function todo(info) {
  console.warn(`\n❗ À faire: ${info}\n`);
  return false;
}
export function error(err) {
  console.warn("\n❌ Oups ! An error occured 😔.\n");
  console.error(err);
  console.error("\n");
  return false;
}

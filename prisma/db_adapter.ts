export function getDatabaseType(argument: string): string {
  if (process.env.DB_TYPE === 'mysql') {
    return `@database.${argument}`;
  } else if (process.env.DB_TYPE === 'postgresql') {
    return `@database.${argument}`; //`@db.${argument}`;
  } else {
    return `@database.${argument}`;
  }
}

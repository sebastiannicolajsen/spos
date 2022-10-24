import * as glob from 'glob';

export const registeredSubscribers = [];
export default async () => {
  const files = glob.sync('*/*.ts', { cwd: __dirname });
  console.log(files)
  for (const file of files) {
    const subscriber = (await import(`./${file}`)).default;
    registeredSubscribers.push(new subscriber());
  }
};

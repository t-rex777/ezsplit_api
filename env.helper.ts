import dotenv from 'dotenv';

let env;

if (process.env.NODE_ENV === undefined) {
  env = dotenv.config();
} else {
  env = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
}

if (env.error) {
  console.error(env.parsed);

  throw env.error;
}

// eslint-disable-next-line no-console
console.log('Environment connected successfully!');

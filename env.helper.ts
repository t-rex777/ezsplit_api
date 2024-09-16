import dotenv from 'dotenv';

const env = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

if (env.error) {
  console.error(env.parsed);

  throw env.error;
}

// eslint-disable-next-line no-console
console.log('Environment connected successfully!');

import { buildApp } from './app';

async function main() {
  const app = buildApp();

  try {
    await app.listen({ port: 3000 });
    console.log('Backend running on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
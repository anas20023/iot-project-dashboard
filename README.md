## Smart Door Dashboard

A protected dashboard for monitoring the Firebase-backed smart door and operating its door lock and buzzer. Email/password accounts and server sessions use the official MongoDB Node.js driver.

## Configuration

Copy `.env.example` to `.env` and fill in its values. Keep `.env` private.

- `MONGODB_URI` is the MongoDB Atlas or self-hosted connection string.
- `MONGODB_DB` is optional and defaults to `smart_door_dashboard`.
- The `NEXT_PUBLIC_FIREBASE_*` values connect the live sensor and control UI to Firebase Realtime Database.

The first sign-up creates the MongoDB `users` and `sessions` collections. User emails are unique; session documents automatically expire after seven days.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Navigate to `http://localhost:3000`. You will be redirected to sign up or log in, then sent to the dashboard.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

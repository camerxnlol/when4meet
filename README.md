# when4meet

A many-to-many scheduling application built with Next.js.

## Features

- **Landing Page** (`/home`): Fill in availability for existing events
- **Create Event** (`/create`): Create new scheduling events
- **Navigation**: Fixed navbar with login and create event buttons
- **Responsive Design**: Modern UI with Tailwind CSS

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The app will automatically redirect to `/home`.

## App Structure

- `/` - Redirects to `/home`
- `/home` - Landing page with availability form
- `/create` - Event creation page

## Components

- `Navbar` - Fixed navigation bar with login and create event buttons
- `EventCreator` - Form for creating new events with date selection
- `When4meet` - Availability selection interface with time grid

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

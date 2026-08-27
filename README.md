# Passport Demo

A minimal Next.js app that displays the identity attached to a request by
[Vercel Passport](https://www.npmjs.com/package/@vercel/passport).

The page is rendered on the server for every request. It shows the structured
identity fields, roles, a highlighted implementation example, and the complete
Passport payload, but never exposes the raw token.

## Local development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Outside production and
Vercel, `@vercel/passport` supplies a development identity by default.

To test a custom local identity, set `VERCEL_PASSPORT_IDENTITY` to a JSON
Passport payload before starting the server.

Roles are read from the `https://example.com/roles` payload claim by default.
Set `PASSPORT_ROLE_CLAIM` to use a different claim:

```bash
PASSPORT_ROLE_CLAIM=https://example.com/roles
```

The claim may contain one role as a string or multiple roles as an array of
strings. Missing, empty, and unsupported values render as `No roles found.`

## Deployment

Deploy the repository to Vercel and configure Passport for the project. Requests
without a valid Passport identity receive an unauthenticated empty state.

The `main` branch is connected to the `passport-demo` project in the Bennor EAA
Demo team. Pushing to `main` creates a production deployment.

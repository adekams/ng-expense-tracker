# Deployment and Environment Setup Guide

## Project Overview

A modern expense management app built with Angular that helps you track your spending, manage multiple currency conversions, and visualize your financial data in real-time.

The app lets you log transactions in different currencies, view your expense summary with real-time currency conversion, and manage your financial data securely. You can create an account, log in, add expenses or income, and see a comprehensive dashboard showing your financial overview.

Tech Stack: Angular 20, Firebase (authentication and database), Tailwind CSS for styling, and real-time currency exchange rate integration.

## Handling Sensitive Keys Safely on GitHub

Follow these steps to protect your keys:

1. Create a `.gitignore` file if it doesn't exist and add your environment files:

```
src/environments/environment.ts
src/environments/environment.prod.ts
```

2. Create template files for reference (without actual keys):

```bash
# Create environment.example.ts
cp src/environments/environment.ts src/environments/environment.example.ts
```

3. Edit the example file to show the structure only:

```typescript
// environment.example.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_AUTH_DOMAIN_HERE",
    projectId: "YOUR_PROJECT_ID_HERE",
    storageBucket: "YOUR_STORAGE_BUCKET_HERE",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
    appId: "YOUR_APP_ID_HERE",
  },
};
```

4. Commit the example file, but never commit the actual environment files with real keys.

5. Document setup in your README for other developers (what you see here).

6. Install dotenv for local development:

```bash
npm install dotenv
```

3. Create a `.env` file locally (add to .gitignore) with your actual keys.

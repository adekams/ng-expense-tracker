# Expense Tracker

A modern expense management app built with Angular that helps you track your spending, manage multiple currency conversions, and visualize your financial data in real-time.

## What This Project Does

The app lets you log transactions in different currencies, view your expense summary with real-time currency conversion, and manage your financial data securely. You can create an account, log in, add expenses or income, and see a comprehensive dashboard showing your financial overview.

## Tech Stack

Built with Angular 20, Firebase (authentication and database), Tailwind CSS for styling, and real-time currency exchange rate integration.

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repo:

```bash
git clone <your-repo-url>
cd ng-expense-tracker
```

2. Install dependencies:

```bash
npm install
```

### Running Locally

Start the development server:

```bash
npm start
```

Open your browser and go to `http://localhost:4200/`. The app will hot-reload as you make changes.

### Building for Production

```bash
npm run build
```

Your production-ready files will be in the `dist/` directory.

### Running Tests

```bash
npm test
```

## Environment Configuration

This project uses environment files for configuration. You'll need to set up your environment variables securely. For detailed instructions on handling sensitive keys safely and deploying to Netlify, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Setup

1. The project uses two environment files:

   - `src/environments/environment.ts` for development
   - `src/environments/environment.prod.ts` for production

2. These files contain sensitive keys like Firebase API keys and auth domains.

## Project Structure

- `/src/app` - Main application component and routes
- `/src/modules/core` - Auth guards and services
- `/src/modules/features` - Feature modules (auth, dashboard, transactions)
- `/src/modules/shared` - Reusable components, pipes, and services
- `/src/environments` - Environment configuration files

## Development Notes

- The app uses Tailwind CSS for styling
- Authentication is handled via Firebase
- Currency conversion happens in real-time using exchange rate service
- State management and component communication through Angular services

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is open source.

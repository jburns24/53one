# 53one Workout App

53one is a SvelteKit-based workout planning application designed to help users implement Jim Wendler's 5/3/1 strength training program. It allows users to track their lifts, generate personalized 5/3/1 workout schedules, and monitor their progress.

## Features

- **Personalized Workout Plans**: Generates 5/3/1 workout schedules based on user's 1 Rep Max (1RM).
- **Progress Tracking**: Allows users to log completed workouts and track their strength gains over time.
- **Google OAuth Authentication**: Secure login with Google accounts.
- **Responsive Design**: Optimized for use on desktop and mobile devices.
- **Dark Mode**: Switch between light and dark themes.

## Tech Stack

- **Frontend**: Svelte 5, SvelteKit
- **Styling**: Tailwind CSS
- **Backend**: Node.js (via SvelteKit)
- **Database**: MongoDB
- **Authentication**: Auth.js (@auth/sveltekit)
- **Testing**: Vitest

## Prerequisites

- Node.js (v20.x or later recommended)
- npm (v10.x or later recommended)
- Docker and Docker Compose (for local development)

## Getting Started

### Local Development with Docker

This is the recommended way to run the application locally.

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd 53one
    ```

2. **Create a `.env` file:**

    Copy the `.env.example` file (if one exists) or create a new `.env` file in the root of the project and add the necessary environment variables. You'll need to configure Google OAuth credentials.

    ```env
    AUTH_SECRET="your_auth_secret" # Generate a strong secret: openssl rand -hex 32
    AUTH_GOOGLE_ID="your_google_client_id"
    AUTH_GOOGLE_SECRET="your_google_client_secret"
    AUTH_TRUST_HOST=true # For local development

    # These are set in docker-compose.yml for development
    # MONGODB_URI=mongodb://mongodb:27017/53one?ssl=false
    # NEXTAUTH_URL=http://localhost:3000
    # ORIGIN=http://localhost:3000
    ```

3. **Build and run the application using Docker Compose:**

    ```bash
    docker-compose up --build
    ```

    This command will build the Docker images (if they don't exist or if the Dockerfile has changed) and start the application and MongoDB services. The `npm install` step is handled within the Docker build process.

4. **Access the application:**

    Open your browser and navigate to `http://localhost:3000`.

### Local Development without Docker (Alternative)

If you prefer not to use Docker, you can run the application directly on your machine.

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd 53one
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root of the project and add the necessary environment variables.

    ```env
    AUTH_SECRET="your_auth_secret"
    AUTH_GOOGLE_ID="your_google_client_id"
    AUTH_GOOGLE_SECRET="your_google_client_secret"
    AUTH_TRUST_HOST=true

    MONGODB_URI="your_local_or_remote_mongodb_uri" # e.g., mongodb://localhost:27017/53one
    NEXTAUTH_URL="http://localhost:5173" # Default Vite port
    ORIGIN="http://localhost:5173"
    ```

4. **Start the development server:**

    ```bash
    npm run dev
    ```

    This will start the Vite development server, typically on `http://localhost:5173`.

5. **Access the application:**

    Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## Building for Production

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you will need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment (e.g., `adapter-node` for Node.js environments, or `adapter-auto` for platforms like Vercel or Netlify). The project is currently configured with `adapter-auto`.

## Testing

The project uses Vitest for unit and integration testing.

- **Run all tests:**

    ```bash
    npm test
    ```

- **Run tests in watch mode:**

    ```bash
    npm run test:watch
    ```

- **Run tests with coverage:**

    ```bash
    npm run test:coverage
    ```

## Project Structure

- `src/lib`: Contains library code (components, server utilities, etc.).
- `src/routes`: Defines the application's pages and API endpoints.
- `static`: For static assets.
- `DEVELOPMENT_PLAN.md`: Outlines the project's features and development progress.

## Contributing

Please refer to the `DEVELOPMENT_PLAN.md` for an overview of current tasks and future plans.

## Disclaimer

The 53one Workout App is a tool designed to assist users in implementing Jim Wendler's 5/3/1 strength training program. Please note the following:

- **Intellectual Property**: The 5/3/1 training methodology and its associated principles are the intellectual property of Jim Wendler. This application is not affiliated with, endorsed by, or sponsored by Jim Wendler.
- **Personal, Non-Commercial Use**: This application is intended for personal, non-commercial use only. It is a tool to help you organize and track your workouts based on the 5/3/1 program.
- **Consult Official Resources**: For complete and authoritative information on the 5/3/1 program, users are strongly encouraged to purchase and consult Jim Wendler's official books and resources.
- **No Warranty & Assumption of Risk**: This software is provided "AS IS", without warranty of any kind. You are solely responsible for your training, safety, and any outcomes resulting from the use of this application. Always consult with a qualified professional before starting any new exercise program.

## License

This project is licensed under the [MIT License](LICENSE.md).

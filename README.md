# E-commerce Frontend

A React.js frontend for an e-commerce application with Redux state management.

## Features

- User authentication and registration
- Product browsing and search
- Shopping cart functionality
- Order management
- Payment integration
- Responsive design with Tailwind CSS

## Tech Stack

- React.js
- Redux Toolkit
- React Router
- Axios for API calls
- Tailwind CSS for styling
- React Icons

## Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## Deployment on Render

1. Connect your GitHub repository to Render
2. Set the following environment variables in Render dashboard:
   - `REACT_APP_API_URL`: Your backend API URL (e.g., https://your-backend.onrender.com)
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Deploy!

## Local Development

```bash
npm install
npm start
```

The app will start on port 3000.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

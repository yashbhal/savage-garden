# Savage Garden

Savage Garden is a plant monitoring system that connects with ESP32 devices to track plant health and environmental conditions. The system helps plant enthusiasts maintain optimal growing conditions while also tracking the positive environmental impact of their plants through carbon savings calculations.

## Features

- Track multiple plants with search functionality
- Monitor sensor data (moisture, temperature, light, weight)
- Calculate carbon savings and environmental impact
- Responsive design for all device sizes

## Tech Stack

- Next.js 12 with TypeScript
- Tailwind CSS for styling
- Chart.js for data visualization
- Context API for state management
- API routes for backend functionality

## Project Structure

- **components/** - Reusable UI components
  - **layout/** - Layout components like headers and footers
  - **plants/** - Plant-specific components
  - **ui/** - Generic UI components
- **lib/** - Application logic
  - **context/** - React Context providers
  - **hooks/** - Custom hooks for data fetching
- **pages/** - Next.js pages and API routes
  - **api/** - API routes for data operations
- **public/** - Static assets
- **styles/** - Global styles
- **types/** - TypeScript type definitions

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ESP32 Integration

The system is designed to connect with ESP32 devices that have sensors for:

- Soil moisture
- Temperature
- Light intensity
- Plant weight

In a production environment, the ESP32 devices would send data to the API endpoints:

- `POST /api/plants/{id}/sensor-data` - Update sensor data for a specific plant

The current implementation uses mock data for demonstration purposes.

## Carbon Savings Calculation

The system calculates carbon savings based on plant data and provides metrics for:

- Total CO₂ absorbed
- Equivalent car miles not driven
- Equivalent number of trees

## Future Development

- Automated watering systems integration
- Machine learning for plant species recognition
- Community features for plant care tips
- Mobile app for on-the-go monitoring

## License

MIT

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

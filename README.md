# Savage Garden

Savage Garden is a plant monitoring system that connects with Particle Photon 2 devices through the Particle Cloud to track plant health and environmental conditions. The system helps plant enthusiasts maintain optimal growing conditions while also tracking the positive environmental impact of their plants through carbon savings and emissions calculations.

## Features

- Track multiple plants with search functionality
- Monitor sensor data (moisture, temperature, light, humidity, pressure)
- Calculate carbon savings and environmental impact
- Track emissions data and water footprint
- Real-time plant care notifications
- Responsive design for all device sizes

## Tech Stack

- Next.js 12 with TypeScript
- Tailwind CSS for styling
- Chart.js for data visualization
- Context API for state management
- Particle Cloud API integration
- API routes for backend functionality

## Project Structure

- **components/** - Reusable UI components
  - **layout/** - Layout components like headers and footers
  - **plants/** - Plant-specific components
  - **ui/** - Generic UI components
  - **notifications/** - Notification components
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

Then, set up your environment variables:

```env
PARTICLE_DEVICE_ID=your_device_id
PARTICLE_ACCESS_TOKEN=your_access_token
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Particle Cloud Integration

The system integrates with Particle Cloud to connect with Particle Photon 2 devices that have sensors for:

- Soil moisture
- Temperature
- Light intensity
- Humidity
- Pressure

The application fetches real-time sensor data through the Particle Cloud API:

- `GET /api/particle-data` - Fetch current sensor readings
- Variables exposed through Particle Cloud:
  - moisture
  - temperature
  - light
  - humidity
  - pressure

## Environmental Impact Tracking

The system provides comprehensive environmental impact metrics:

### Carbon Savings
- Total CO₂ absorbed
- Equivalent car miles not driven
- Equivalent number of trees

### Emissions Data
- Historical emissions tracking
- Water footprint calculations
- Energy consumption tracking
- Environmental impact comparisons

## Notifications

The system includes a notification system for:
- Plant care reminders
- Environmental alerts
- Sensor status updates

## Future Development

- Automated watering systems integration
- Machine learning for plant species recognition
- Community features for plant care tips
- Mobile app for on-the-go monitoring
- Enhanced environmental impact tracking

## License

MIT

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Particle Cloud API Documentation](https://docs.particle.io/reference/cloud-apis/api/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

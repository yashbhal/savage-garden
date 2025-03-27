# Savage Garden v2: Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Data Structures](#core-data-structures)
4. [Frontend Components](#frontend-components)
5. [Data Flow & State Management](#data-flow--state-management)
6. [API Endpoints](#api-endpoints)
7. [Custom Hooks](#custom-hooks)
8. [Features & Functionality](#features--functionality)
9. [Development & Deployment](#development--deployment)

## Introduction

Savage Garden v2 is a modern web application built with Next.js and React, designed to help users track and monitor their plants using sensor data. The application helps users visualize their plant data, track carbon savings, and make informed decisions about plant care.

The application follows a client-server architecture where the frontend is built with React components, and the backend is implemented as Next.js API routes. Data is fetched and managed using custom hooks and context APIs.

## Project Structure

The project follows a standard Next.js folder structure:

```
savage-garden-v2/
├── components/      # Reusable UI components
│   ├── layout/      # Layout components (Header, Footer, etc.)
│   ├── plants/      # Plant-specific components
│   └── ui/          # Generic UI components
├── lib/             # Utility functions, hooks, and contexts
│   ├── context/     # React Context for state management
│   └── hooks/       # Custom React hooks
├── pages/           # Next.js pages and API routes
│   ├── api/         # Backend API endpoints
│   └── plants/      # Plant-specific pages
├── public/          # Static assets
├── styles/          # Global CSS and styling
└── types/           # TypeScript type definitions
```

## Core Data Structures

The application uses several core data structures defined in `types/index.ts`:

### Plant

Represents a plant in the system:

```typescript
interface Plant {
  id: string;
  name: string;
  species: string;
  location: string;
  imageUrl: string;
  dateAdded: string;
  lastWatered: string;
  description?: string;
  sensorId?: string;
  carbonSavings: number;
}
```

### SensorReading

Represents a single sensor reading from a plant:

```typescript
interface SensorReading {
  timestamp: string;
  moisture: number; // 0-100%
  temperature: number; // celsius
  light: number; // lux
  weight: number; // grams
}
```

### SensorData

Represents all sensor data associated with a plant:

```typescript
interface SensorData {
  sensorId: string;
  plantId: string;
  currentReading: SensorReading;
  readings: SensorReading[];
}
```

### CarbonSavings

Represents carbon savings data:

```typescript
interface CarbonSavings {
  totalCO2Absorbed: number; // grams
  equivalentCarMiles: number;
  treesEquivalent: number;
  dailyRate: number; // grams per day
}
```

## Frontend Components

The application uses a component-based architecture. Key components include:

### Layout Components
- Header/Navbar
- Footer
- Layout wrapper

### Plant Components
- PlantCard: Displays basic plant information
- PlantDetails: Shows detailed plant information
- PlantForm: Used for adding/editing plants

### UI Components
- DataChart: Displays sensor data in charts
- Cards, buttons, and other generic UI elements

## Data Flow & State Management

### PlantContext

The application uses a PlantContext (`lib/context/PlantContext.tsx`) for global state management of plants. It provides:

- A list of all plants
- Loading and error states
- Methods for adding, updating, and deleting plants
- A method for refreshing plants

### State Flow

1. The PlantContext initializes by fetching plants from the API
2. Components use the `usePlants` hook to access plant data
3. When modifications are made, the context updates its state and persists changes to the API
4. The updated state is propagated to all consuming components

## API Endpoints

The application exposes several RESTful API endpoints:

### Plants API

- `GET /api/plants`: Retrieves all plants
- `POST /api/plants`: Creates a new plant
- `GET /api/plants/[id]`: Retrieves a specific plant
- `PUT /api/plants/[id]`: Updates a specific plant
- `DELETE /api/plants/[id]`: Deletes a specific plant

### Sensor Data API

- `GET /api/plants/[id]/sensor-data`: Retrieves sensor data for a specific plant
- `GET /api/plants/[id]/readings`: Retrieves sensor readings for a specific plant
- `GET /api/readings`: Retrieves all sensor readings

### Carbon Savings API

- `GET /api/carbon-savings`: Retrieves total carbon savings
- `GET /api/carbon-savings?plantId=[id]`: Retrieves carbon savings for a specific plant

## Custom Hooks

The application uses several custom hooks to encapsulate logic and provide a cleaner interface for components:

### usePlants

A hook to access the PlantContext for plant data and operations.

```typescript
const { plants, loading, error, addPlant, updatePlant, deletePlant } = usePlants();
```

### useSensorData

A hook to fetch and manage sensor data for a specific plant.

```typescript
const { sensorData, loading, error, refreshData } = useSensorData(plantId);
```

### useCarbonSavings

A hook to fetch and manage carbon savings data.

```typescript
const { carbonSavings, loading, error, refreshData } = useCarbonSavings(plantId);
```

### useReadings

A hook to fetch, filter, and aggregate sensor readings with time range filtering.

```typescript
const { 
  readings, 
  filteredReadings, 
  timeRange, 
  setTimeRange, 
  loading, 
  error, 
  refreshReadings, 
  aggregateData 
} = useReadings(plantId);
```

## Features & Functionality

### Dashboard

The dashboard displays aggregate information and charts:
- Total number of plants
- Carbon savings metrics
- Sensor data visualizations with time filtering
- Average metrics for moisture, temperature, light, and weight

### Plant Management

Users can:
- View a list of all plants
- Add new plants
- Update existing plants
- Delete plants
- View detailed information about each plant

### Sensor Data Visualization

The application visualizes sensor data using charts:
- Historical data with time range filtering (24 hours, 7 days, 30 days)
- Different chart views for moisture, temperature, light, and weight
- Aggregated metrics

### Carbon Savings Tracking

The application tracks carbon savings:
- Total CO2 absorbed
- Equivalent car miles
- Trees equivalent
- Daily absorption rate

## Development & Deployment

### Local Development

To run the application locally:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To build the application for production:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Environment Variables

The application may use the following environment variables:

- `NEXT_PUBLIC_API_URL`: Base URL for API requests (if using external API)
- `DATABASE_URL`: Connection string for the database (if applicable)
# Savage Garden v2: Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Data Structures](#core-data-structures)
4. [Frontend Components](#frontend-components)
5. [Data Flow & State Management](#data-flow--state-management)
6. [API Endpoints](#api-endpoints)
7. [Custom Hooks](#custom-hooks)
8. [Environmental Impact Tracking](#environmental-impact-tracking)
9. [Notification System](#notification-system)
10. [Development & Deployment](#development--deployment)

## Introduction

Savage Garden v2 is a modern web application built with Next.js and React, designed to help users track and monitor their plants using sensor data. The backend connects to Particle Photon 2 devices via the Particle Cloud API. All plant sensor data is fetched securely using device- and user-specific credentials. The application helps users visualize their plant data, track carbon savings and emissions, and make informed decisions about plant care through real-time notifications and environmental impact metrics.

The application follows a client-server architecture where the frontend is built with React components, and the backend is implemented as Next.js API routes. Data is fetched and managed using custom hooks and context APIs.

## Project Structure

```
savage-garden-v2/
├── components/      # Reusable UI components
│   ├── layout/      # Layout components (Header, Footer, etc.)
│   ├── plants/      # Plant-specific components
│   ├── notifications/ # Notification components
│   └── ui/          # Generic UI components (PageTransition, SkeletonLoader)
├── lib/             # Utility functions, hooks, and contexts
│   ├── context/     # React Context for state management (PlantContext, NotificationContext)
│   └── hooks/       # Custom React hooks
├── pages/           # Next.js pages and API routes
│   ├── api/         # Backend API endpoints
│   ├── plants/      # Plant-specific pages
│   └── footprint/   # Environmental footprint tracking page
├── public/          # Static assets
├── styles/          # Global CSS and aesthetic styling
│   ├── globals.css  # Base styles
│   └── aesthetic.css # Enhanced animations and interactions
└── types/           # TypeScript type definitions
```

## Core Data Structures

The application uses several core data structures defined in `types/index.ts`:

### Plant

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

```typescript
interface SensorReading {
  timestamp: string;
  moisture: number; // 0-100%
  temperature: number; // Celsius
  light: number; // Lux
  humidity: number; // %
  pressure: number; // hPa
}
```

### EmissionsData

```typescript
interface EmissionsData {
  date: string;
  co2: number;
  waterUsage: number;
  energyConsumption: number;
}
```

### NotificationConfig

```typescript
interface NotificationConfig {
  type: 'care' | 'environmental' | 'sensor';
  message: string;
  priority: 'low' | 'medium' | 'high';
  displayDuration?: number;
}
```

## Frontend Components

### Plant Components
- `PlantCard`: Displays plant summary information
- `PlantDetails`: Shows detailed plant information and sensor data
- `AddPlantForm`: Form for adding new plants

### Notification Components
- `LightNotification`: Static notification for plant light requirements, styled minimally with Tailwind, visible on the homepage ("Turn on the glow lamp for Plant 1").
- `NotificationContainer`: Manages multiple notifications (future extension)
- `NotificationMessage`: Individual notification display (future extension)

### Environmental Components
- `EmissionsChart`: Visualizes emissions data
- `CarbonSavingsMetrics`: Displays carbon savings information
- `WaterFootprintDisplay`: Shows water usage statistics

## Environmental Impact Tracking

The system tracks various environmental metrics:

### Carbon Savings
- Calculates CO₂ absorption based on plant species and growth
- Converts to equivalent metrics (car miles, trees)
- Tracks historical carbon savings

### Emissions Data
- Records and displays emissions history
- Calculates water footprint
- Tracks energy consumption
- Provides comparative environmental impact data

### Data Sources
- Plant-specific absorption rates
- Historical emissions data
- Water usage calculations
- Particle Cloud sensor data

## Notification System

The notification system provides users with timely plant care reminders and system updates.

### Types of Notifications
1. Plant Care Reminders
   - Watering schedules
   - Light requirements
   - Humidity alerts
2. System Updates
   - Connection status
   - New features
3. Sensor Status
   - Connection issues
   - Battery levels
   - Calibration requirements

### Implementation
- Automated notifications that appear every 30 seconds
- Global notification context provider (`NotificationContext`)
- Customizable notification components (`LightNotification`)
- Randomized notification messages from a predefined set
- Smooth fade-in/fade-out animations for better user experience
- Styled using Tailwind CSS, non-intrusive and minimal
- Configurable duration and auto-dismissal behavior
- Future extensibility for dynamic and priority-based notifications

## UI Enhancements

The application includes several UI enhancements to improve user experience:

### Page Transitions
- Smooth fade transitions between pages using Framer Motion
- Consistent animation timing and easing for a polished feel
- Implementation via `PageTransition` component and AnimatePresence

### Loading States
- Skeleton loaders for content while data is loading
- Different skeleton types for cards, text blocks, and metrics
- Animated pulse effect for better visual feedback

### Micro-interactions
- Subtle card hover effects with scale transforms (1.02-1.03)
- Button press effects that scale down slightly on click
- Gentle color transitions on interactive elements
- Consistent spacing and padding optimized for mobile

### Responsive Design
- Mobile-first approach with progressive enhancement
- Hamburger menu for mobile navigation
- Optimized touch targets and spacing for mobile devices
- Consistent design language across all screen sizes

## API Endpoints

### Particle Cloud Data
- `GET /api/particle-data`: Fetches the latest sensor data from the Particle Cloud for the configured device using environment variables `PARTICLE_DEVICE_ID` and `PARTICLE_ACCESS_TOKEN`.

### Plant Data
- `GET /api/plants` - List all plants
- `POST /api/plants` - Create new plant
- `GET /api/plants/{id}` - Get plant details
- `PUT /api/plants/{id}` - Update plant
- `DELETE /api/plants/{id}` - Delete plant

### Environmental Data
- `GET /api/carbon-savings` - Get carbon savings metrics
- `GET /api/emissions` - Get emissions data
- `GET /api/water-footprint` - Get water usage data

## Custom Hooks

### Plant Management
```typescript
const { plants, loading, error, addPlant, updatePlant, deletePlant } = usePlants();
```

### Environmental Data
```typescript
const { carbonSavings, emissions, waterFootprint } = useEnvironmentalData();
```

### Notifications
```typescript
const { showNotification, hideNotification, updateNotification } = useNotifications();
```

## Development & Deployment

### Local Development
1. Install dependencies: `npm install`
2. Set up environment variables:
   - `PARTICLE_DEVICE_ID`: Your Particle device's ID
   - `PARTICLE_ACCESS_TOKEN`: Your Particle Cloud access token
3. Run development server: `npm run dev`
4. Access at: `http://localhost:3000`

### Production Deployment
- Automated deployment via Vercel
- Environment variable configuration
- Build optimization
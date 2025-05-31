# ProofPix Enterprise Analytics Dashboard Setup Guide

This guide will help you set up and configure the ProofPix Enterprise Analytics Dashboard in your application.

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- A React application (v16.8+ with hooks support)

## Installation

1. Install required dependencies:

```bash
# Core dependencies
npm install chart.js react-chartjs-2 chartjs-adapter-date-fns date-fns

# Drag and drop functionality
npm install @dnd-kit/core @dnd-kit/sortable

# UI components
npm install @radix-ui/react-tabs tailwind-merge clsx

# Icons
npm install lucide-react
```

2. Add the components to your project structure:

```
src/
├── components/
│   └── analytics/
│       ├── RealTimeMetricsDashboard.tsx
│       ├── CustomDashboardBuilder.tsx
│       ├── PerformanceTrackingSystem.tsx
│       ├── SortableWidget.tsx
│       ├── WidgetSettings.tsx
├── pages/
│   └── AnalyticsDashboard.tsx
├── services/
│   └── advancedAnalyticsService.ts
└── utils/
    └── cn.ts
```

3. Ensure your application has the necessary CSS setup for Tailwind (if using Tailwind CSS).

## Integration

Add the AnalyticsDashboard to your application's routing:

```jsx
// In your App.tsx or routing configuration
import { Routes, Route } from 'react-router-dom';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

function App() {
  return (
    <Routes>
      {/* Other routes */}
      <Route path="/analytics" element={<AnalyticsDashboard />} />
    </Routes>
  );
}
```

## Configuration

### Analytics Service

The dashboard components rely on the `advancedAnalyticsService` for data. You will need to:

1. Configure the service to connect to your data source
2. Implement the necessary methods for retrieving analytics data
3. Ensure proper data formatting for chart components

### Theme Support

The dashboard supports both light and dark themes. To enable theme switching:

1. Set up a theme context in your application (if not already present)
2. Pass the theme value to the AnalyticsDashboard component
3. Customize theme colors in the components if needed

## Usage Examples

### Basic Usage

```jsx
import AnalyticsDashboard from './pages/AnalyticsDashboard';

function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
```

### With Custom Theme

```jsx
import AnalyticsDashboard from './pages/AnalyticsDashboard';

function AnalyticsPage() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeProvider theme={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
      <AnalyticsDashboard theme={theme} />
    </ThemeProvider>
  );
}
```

## Troubleshooting

### Common Issues

1. **Charts not rendering**: Ensure Chart.js and its dependencies are properly installed and registered.

2. **Drag and drop not working**: Check that `@dnd-kit/core` and `@dnd-kit/sortable` are correctly installed and imported.

3. **Styling issues**: Verify that Tailwind CSS is properly configured and that the `cn` utility function is available.

4. **Data not loading**: Check the configuration of `advancedAnalyticsService` and verify that API endpoints are correctly specified.

## Customization

The analytics dashboard components can be customized by:

1. Modifying theme colors in each component
2. Extending chart configurations for different visualization needs
3. Adding new widget types to the CustomDashboardBuilder
4. Customizing the layout and behavior of tabs in the main dashboard

Refer to the component documentation for more detailed customization options. 
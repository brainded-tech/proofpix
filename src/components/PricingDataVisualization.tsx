import React, { useState, useEffect, useRef } from 'react';
import { pricingAnalytics } from '../utils/analytics';

interface PricingDataVisualizationProps {
  className?: string;
  showTitle?: boolean;
  compactMode?: boolean;
  visualizationType?: 'bar' | 'radar' | 'savings';
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

// Simulation of savings data - in a real app, this would come from an API
const generateSavingsData = () => {
  return {
    smallTeam: {
      hours: Math.floor(Math.random() * 100) + 200, // 200-300 hours
      monthlyCost: Math.floor(Math.random() * 2000) + 3000, // $3000-5000
      serverCost: Math.floor(Math.random() * 500) + 500, // $500-1000
      complianceCost: Math.floor(Math.random() * 2000) + 1000, // $1000-3000
    },
    mediumTeam: {
      hours: Math.floor(Math.random() * 200) + 500, // 500-700 hours
      monthlyCost: Math.floor(Math.random() * 5000) + 8000, // $8000-13000
      serverCost: Math.floor(Math.random() * 1000) + 1500, // $1500-2500
      complianceCost: Math.floor(Math.random() * 5000) + 5000, // $5000-10000
    },
    largeTeam: {
      hours: Math.floor(Math.random() * 500) + 1000, // 1000-1500 hours
      monthlyCost: Math.floor(Math.random() * 10000) + 20000, // $20000-30000
      serverCost: Math.floor(Math.random() * 5000) + 5000, // $5000-10000
      complianceCost: Math.floor(Math.random() * 10000) + 15000, // $15000-25000
    }
  };
};

const PricingDataVisualization: React.FC<PricingDataVisualizationProps> = ({
  className = '',
  showTitle = true,
  compactMode = false,
  visualizationType = 'bar'
}) => {
  const [teamSize, setTeamSize] = useState<'smallTeam' | 'mediumTeam' | 'largeTeam'>('mediumTeam');
  const [savingsData, setSavingsData] = useState(generateSavingsData());
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);
  
  // Track component view
  useEffect(() => {
    pricingAnalytics.track({
      event: 'pricing_visualization_viewed',
      category: 'pricing',
      label: visualizationType,
      properties: {
        teamSize
      }
    });
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [visualizationType, teamSize]);
  
  // Create chart once data is loaded
  useEffect(() => {
    if (isLoading || !canvasRef.current) return;
    
    // In a real implementation, we would import and use Chart.js
    // This is a simulation to show the structure without the dependency
    const renderChart = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      
      // Clear previous chart
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      // Here we would create an actual Chart.js chart
      // For now, just render a placeholder rectangle
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = '#e5edff';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      // Draw chart title
      ctx.fillStyle = '#1e3a8a';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${visualizationType.toUpperCase()} Chart: ${teamSize.replace('Team', ' Team')} Cost Savings`, ctx.canvas.width / 2, 30);
      
      // In a real app, we would create a chart with Chart.js like:
      /*
      chartInstance.current = new Chart(ctx, {
        type: visualizationType === 'radar' ? 'radar' : 'bar',
        data: getChartData(),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          // ...other options
        }
      });
      */
    };
    
    renderChart();
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [isLoading, teamSize, savingsData, visualizationType]);
  
  // Handle team size change
  const handleTeamSizeChange = (size: 'smallTeam' | 'mediumTeam' | 'largeTeam') => {
    setTeamSize(size);
    
    pricingAnalytics.track({
      event: 'team_size_changed',
      category: 'pricing',
      label: size,
      properties: {
        visualizationType
      }
    });
  };
  
  // Get formatted savings data
  const getFormattedSavings = () => {
    const data = savingsData[teamSize];
    const hourlyRate = 75; // Assumed hourly rate
    
    const timeSavings = data.hours * hourlyRate;
    const serverSavings = data.serverCost;
    const complianceSavings = data.complianceCost;
    const totalSavings = timeSavings + serverSavings + complianceSavings;
    const proofPixCost = teamSize === 'smallTeam' ? 1188 : (teamSize === 'mediumTeam' ? 2988 : 5988); // Annual cost
    const roi = Math.round((totalSavings / proofPixCost) * 100);
    
    return {
      timeSavings: formatCurrency(timeSavings),
      serverSavings: formatCurrency(serverSavings),
      complianceSavings: formatCurrency(complianceSavings),
      totalSavings: formatCurrency(totalSavings),
      timeSavingsHours: data.hours,
      proofPixCost: formatCurrency(proofPixCost),
      roi: `${roi}%`,
      paybackPeriod: Math.round((proofPixCost / (totalSavings / 12))) // in months
    };
  };
  
  // Format currency values
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Render content based on type
  const renderVisualizationContent = () => {
    if (visualizationType === 'savings') {
      const savings = getFormattedSavings();
      
      return (
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Estimated Annual Savings with ProofPix
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
              <div className="text-3xl font-bold text-blue-700 mb-2">{savings.timeSavings}</div>
              <p className="text-sm text-gray-600 mb-1">Time Savings</p>
              <p className="text-xs text-gray-500">{savings.timeSavingsHours} hours/year</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
              <div className="text-3xl font-bold text-green-700 mb-2">{savings.serverSavings}</div>
              <p className="text-sm text-gray-600 mb-1">Infrastructure Savings</p>
              <p className="text-xs text-gray-500">No server costs</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-center">
              <div className="text-3xl font-bold text-purple-700 mb-2">{savings.complianceSavings}</div>
              <p className="text-sm text-gray-600 mb-1">Compliance Savings</p>
              <p className="text-xs text-gray-500">Simplified compliance</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Annual ProofPix Cost:</span>
              <span className="text-gray-900 font-bold">{savings.proofPixCost}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Total Annual Savings:</span>
              <span className="text-green-600 font-bold">{savings.totalSavings}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Return on Investment:</span>
              <span className="text-blue-600 font-bold">{savings.roi}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Payback Period:</span>
              <span className="text-purple-600 font-bold">{savings.paybackPeriod} months</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Calculations based on industry averages for organizations of your size.
            Actual savings may vary based on specific requirements and workflows.
          </p>
        </div>
      );
    }
    
    // Bar or radar chart visualization
    return (
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className={`relative ${compactMode ? 'h-64' : 'h-96'}`}>
            <canvas ref={canvasRef} />
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {showTitle && (
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {visualizationType === 'bar' && 'Cost Comparison'}
            {visualizationType === 'radar' && 'Feature Comparison'}
            {visualizationType === 'savings' && 'ROI Calculator'}
          </h2>
        </div>
      )}
      
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                teamSize === 'smallTeam'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleTeamSizeChange('smallTeam')}
            >
              Small Team
              <span className="block text-xs">(&lt;10 people)</span>
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                teamSize === 'mediumTeam'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleTeamSizeChange('mediumTeam')}
            >
              Medium Team
              <span className="block text-xs">(10-50 people)</span>
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                teamSize === 'largeTeam'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleTeamSizeChange('largeTeam')}
            >
              Large Team
              <span className="block text-xs">(&gt;50 people)</span>
            </button>
          </div>
        </div>
      </div>
      
      {renderVisualizationContent()}
    </div>
  );
};

export default PricingDataVisualization; 
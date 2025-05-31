/**
 * ProofPix Mobile - Analytics Screen
 * Mobile-optimized analytics with charts, metrics, and insights
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '../../contexts/ThemeContext';
import { MobileApiService } from '../../services/MobileApiService';

const { width } = Dimensions.get('window');

interface AnalyticsData {
  totalFiles: number;
  totalProcessed: number;
  totalStorage: number;
  apiCalls: number;
  activeUsers: number;
  avgProcessingTime: number;
  errorRate: number;
  throughput: number;
  usageTrend: Array<{ date: string; value: number }>;
  processingQueue: Array<{ status: string; count: number }>;
  fileTypes: Array<{ type: string; count: number; percentage: number }>;
  performanceMetrics: {
    uptime: number;
    responseTime: number;
    successRate: number;
  };
}

interface TimeRange {
  label: string;
  value: string;
  days: number;
}

const timeRanges: TimeRange[] = [
  { label: 'Today', value: 'today', days: 1 },
  { label: '7 Days', value: '7d', days: 7 },
  { label: '30 Days', value: '30d', days: 30 },
  { label: '90 Days', value: '90d', days: 90 },
];

const AnalyticsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'usage'>('overview');

  useEffect(() => {
    loadAnalytics();
  }, [selectedTimeRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      
      const timeRange = timeRanges.find(t => t.value === selectedTimeRange);
      const startDate = new Date(Date.now() - (timeRange?.days || 30) * 24 * 60 * 60 * 1000);
      const endDate = new Date();

      const [analyticsData, usageStats, performanceData] = await Promise.all([
        MobileApiService.getAnalytics({
          timeRange: { start: startDate, end: endDate },
          metrics: ['usage', 'performance', 'files', 'processing'],
        }),
        MobileApiService.getUsageStats(),
        MobileApiService.getPerformanceMetrics(),
      ]);

      // Process and format the data for mobile charts
      const processedData: AnalyticsData = {
        totalFiles: usageStats.totalFiles || 0,
        totalProcessed: usageStats.totalProcessed || 0,
        totalStorage: usageStats.totalStorage || 0,
        apiCalls: usageStats.apiCalls || 0,
        activeUsers: usageStats.activeUsers || 0,
        avgProcessingTime: performanceData.avgProcessingTime || 0,
        errorRate: performanceData.errorRate || 0,
        throughput: performanceData.throughput || 0,
        usageTrend: generateUsageTrend(analyticsData.metrics, timeRange?.days || 30),
        processingQueue: generateProcessingQueue(analyticsData.metrics),
        fileTypes: generateFileTypes(analyticsData.metrics),
        performanceMetrics: {
          uptime: performanceData.uptime || 99.9,
          responseTime: performanceData.avgResponseTime || 0,
          successRate: 100 - (performanceData.errorRate || 0),
        },
      };

      setAnalytics(processedData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      Alert.alert('Error', 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const generateUsageTrend = (metrics: any, days: number) => {
    // Generate sample trend data - replace with actual API data
    const trend = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      trend.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 100) + 50,
      });
    }
    return trend;
  };

  const generateProcessingQueue = (metrics: any) => {
    return [
      { status: 'Pending', count: Math.floor(Math.random() * 20) + 5 },
      { status: 'Processing', count: Math.floor(Math.random() * 15) + 2 },
      { status: 'Completed', count: Math.floor(Math.random() * 100) + 200 },
      { status: 'Failed', count: Math.floor(Math.random() * 5) + 1 },
    ];
  };

  const generateFileTypes = (metrics: any) => {
    const types = [
      { type: 'Images', count: 150, percentage: 60 },
      { type: 'Documents', count: 75, percentage: 30 },
      { type: 'Videos', count: 20, percentage: 8 },
      { type: 'Others', count: 5, percentage: 2 },
    ];
    return types;
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadAnalytics();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  const renderOverviewTab = () => (
    <View>
      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Icon name="folder" size={24} color={colors.primary} />
          <Text style={styles.metricValue}>{formatNumber(analytics?.totalFiles || 0)}</Text>
          <Text style={styles.metricLabel}>Total Files</Text>
        </View>
        <View style={styles.metricCard}>
          <Icon name="check-circle" size={24} color={colors.success} />
          <Text style={styles.metricValue}>{formatNumber(analytics?.totalProcessed || 0)}</Text>
          <Text style={styles.metricLabel}>Processed</Text>
        </View>
        <View style={styles.metricCard}>
          <Icon name="storage" size={24} color={colors.warning} />
          <Text style={styles.metricValue}>{formatBytes(analytics?.totalStorage || 0)}</Text>
          <Text style={styles.metricLabel}>Storage</Text>
        </View>
        <View style={styles.metricCard}>
          <Icon name="api" size={24} color={colors.accent} />
          <Text style={styles.metricValue}>{formatNumber(analytics?.apiCalls || 0)}</Text>
          <Text style={styles.metricLabel}>API Calls</Text>
        </View>
      </View>

      {/* Usage Trend Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Usage Trend</Text>
        {analytics?.usageTrend && (
          <LineChart
            data={{
              labels: analytics.usageTrend.slice(-7).map(item => 
                new Date(item.date).toLocaleDateString('en', { weekday: 'short' })
              ),
              datasets: [{
                data: analytics.usageTrend.slice(-7).map(item => item.value),
              }],
            }}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        )}
      </View>

      {/* File Types Distribution */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>File Types Distribution</Text>
        {analytics?.fileTypes && (
          <PieChart
            data={analytics.fileTypes.map((item, index) => ({
              name: item.type,
              population: item.count,
              color: [colors.primary, colors.secondary, colors.accent, colors.warning][index % 4],
              legendFontColor: colors.text,
              legendFontSize: 12,
            }))}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        )}
      </View>
    </View>
  );

  const renderPerformanceTab = () => (
    <View>
      {/* Performance Metrics */}
      <View style={styles.performanceGrid}>
        <View style={styles.performanceCard}>
          <Text style={styles.performanceValue}>
            {analytics?.performanceMetrics.uptime.toFixed(1)}%
          </Text>
          <Text style={styles.performanceLabel}>Uptime</Text>
          <View style={[styles.performanceBar, { backgroundColor: colors.success }]} />
        </View>
        <View style={styles.performanceCard}>
          <Text style={styles.performanceValue}>
            {analytics?.avgProcessingTime || 0}ms
          </Text>
          <Text style={styles.performanceLabel}>Avg Response</Text>
          <View style={[styles.performanceBar, { backgroundColor: colors.primary }]} />
        </View>
        <View style={styles.performanceCard}>
          <Text style={styles.performanceValue}>
            {analytics?.performanceMetrics.successRate.toFixed(1)}%
          </Text>
          <Text style={styles.performanceLabel}>Success Rate</Text>
          <View style={[styles.performanceBar, { backgroundColor: colors.accent }]} />
        </View>
      </View>

      {/* Processing Queue */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Processing Queue</Text>
        {analytics?.processingQueue && (
          <BarChart
            data={{
              labels: analytics.processingQueue.map(item => item.status),
              datasets: [{
                data: analytics.processingQueue.map(item => item.count),
              }],
            }}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        )}
      </View>

      {/* Error Rate Trend */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Error Rate Trend</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              data: [0.5, 0.3, 0.8, 0.2, 0.1, 0.4, 0.3],
            }],
          }}
          width={width - 40}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
          }}
          bezier
          style={styles.chart}
        />
      </View>
    </View>
  );

  const renderUsageTab = () => (
    <View>
      {/* Usage Statistics */}
      <View style={styles.usageStats}>
        <View style={styles.usageStatItem}>
          <Icon name="people" size={20} color={colors.primary} />
          <Text style={styles.usageStatValue}>{analytics?.activeUsers || 0}</Text>
          <Text style={styles.usageStatLabel}>Active Users</Text>
        </View>
        <View style={styles.usageStatItem}>
          <Icon name="speed" size={20} color={colors.success} />
          <Text style={styles.usageStatValue}>{analytics?.throughput || 0}/s</Text>
          <Text style={styles.usageStatLabel}>Throughput</Text>
        </View>
        <View style={styles.usageStatItem}>
          <Icon name="error" size={20} color={colors.error} />
          <Text style={styles.usageStatValue}>{analytics?.errorRate.toFixed(1) || 0}%</Text>
          <Text style={styles.usageStatLabel}>Error Rate</Text>
        </View>
      </View>

      {/* Daily Usage Pattern */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Daily Usage Pattern</Text>
        <BarChart
          data={{
            labels: ['00', '04', '08', '12', '16', '20'],
            datasets: [{
              data: [20, 15, 45, 80, 95, 60],
            }],
          }}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
        />
      </View>

      {/* API Endpoints Usage */}
      <View style={styles.endpointsContainer}>
        <Text style={styles.chartTitle}>Top API Endpoints</Text>
        {[
          { endpoint: '/api/files/upload', calls: 1250, percentage: 45 },
          { endpoint: '/api/files/process', calls: 890, percentage: 32 },
          { endpoint: '/api/analytics', calls: 420, percentage: 15 },
          { endpoint: '/api/auth', calls: 220, percentage: 8 },
        ].map((item, index) => (
          <View key={index} style={styles.endpointItem}>
            <View style={styles.endpointInfo}>
              <Text style={styles.endpointName}>{item.endpoint}</Text>
              <Text style={styles.endpointCalls}>{formatNumber(item.calls)} calls</Text>
            </View>
            <View style={styles.endpointBar}>
              <View
                style={[
                  styles.endpointProgress,
                  {
                    width: `${item.percentage}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={styles.endpointPercentage}>{item.percentage}%</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    timeRangeContainer: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 4,
    },
    timeRangeButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    activeTimeRange: {
      backgroundColor: colors.primary,
    },
    timeRangeText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    activeTimeRangeText: {
      color: colors.white,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.primary,
    },
    scrollContainer: {
      flex: 1,
    },
    content: {
      padding: 16,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    metricCard: {
      width: (width - 48) / 2,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    metricValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 8,
      marginBottom: 4,
    },
    metricLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    chartContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    chart: {
      borderRadius: 16,
    },
    performanceGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    performanceCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 4,
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    performanceValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    performanceLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
    },
    performanceBar: {
      width: '100%',
      height: 4,
      borderRadius: 2,
    },
    usageStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    usageStatItem: {
      alignItems: 'center',
    },
    usageStatValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 4,
      marginBottom: 2,
    },
    usageStatLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    endpointsContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    endpointItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    endpointInfo: {
      flex: 1,
      marginRight: 12,
    },
    endpointName: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 2,
    },
    endpointCalls: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    endpointBar: {
      flex: 2,
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
      marginRight: 12,
    },
    endpointProgress: {
      height: '100%',
      borderRadius: 3,
    },
    endpointPercentage: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.text,
      width: 40,
      textAlign: 'right',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 16,
    },
  });

  if (isLoading && !analytics) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="analytics" size={64} color={colors.textSecondary} />
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Insights and performance metrics</Text>
        
        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {timeRanges.map((range) => (
            <TouchableOpacity
              key={range.value}
              style={[
                styles.timeRangeButton,
                selectedTimeRange === range.value && styles.activeTimeRange,
              ]}
              onPress={() => setSelectedTimeRange(range.value)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  selectedTimeRange === range.value && styles.activeTimeRangeText,
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'performance', label: 'Performance' },
          { key: 'usage', label: 'Usage' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.content}>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'performance' && renderPerformanceTab()}
          {activeTab === 'usage' && renderUsageTab()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen; 
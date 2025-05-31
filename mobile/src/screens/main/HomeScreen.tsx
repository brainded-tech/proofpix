/**
 * ProofPix Mobile - Home Screen
 * Main dashboard with stats, recent activity, and quick actions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { MobileApiService } from '../../services/MobileApiService';
import { useRealTimeUpdates } from '../../hooks/useRealTimeUpdates';

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalFiles: number;
  processingFiles: number;
  completedToday: number;
  storageUsed: string;
  apiCalls: number;
}

interface RecentActivity {
  id: string;
  type: 'upload' | 'processing' | 'completed' | 'error';
  message: string;
  timestamp: Date;
  fileId?: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalFiles: 0,
    processingFiles: 0,
    completedToday: 0,
    storageUsed: '0 MB',
    apiCalls: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time updates
  const { isConnected, lastUpdate } = useRealTimeUpdates({
    onFileProcessed: (data) => {
      setRecentActivity(prev => [{
        id: Date.now().toString(),
        type: 'completed',
        message: `File "${data.filename}" processed successfully`,
        timestamp: new Date(),
        fileId: data.id,
      }, ...prev.slice(0, 9)]);
      
      setStats(prev => ({
        ...prev,
        processingFiles: Math.max(0, prev.processingFiles - 1),
        completedToday: prev.completedToday + 1,
      }));
    },
    onFileUploaded: (data) => {
      setRecentActivity(prev => [{
        id: Date.now().toString(),
        type: 'upload',
        message: `File "${data.filename}" uploaded`,
        timestamp: new Date(),
        fileId: data.id,
      }, ...prev.slice(0, 9)]);
      
      setStats(prev => ({
        ...prev,
        totalFiles: prev.totalFiles + 1,
        processingFiles: prev.processingFiles + 1,
      }));
    },
    onError: (error) => {
      setRecentActivity(prev => [{
        id: Date.now().toString(),
        type: 'error',
        message: error.message,
        timestamp: new Date(),
      }, ...prev.slice(0, 9)]);
    },
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load stats and recent activity in parallel
      const [statsData, activityData] = await Promise.all([
        MobileApiService.getAnalytics({
          timeRange: {
            start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            end: new Date(),
          },
        }),
        MobileApiService.getFiles({ limit: 10 }),
      ]);

      setStats({
        totalFiles: statsData.totalFiles || 0,
        processingFiles: statsData.processingFiles || 0,
        completedToday: statsData.completedToday || 0,
        storageUsed: statsData.storageUsed || '0 MB',
        apiCalls: statsData.apiCalls || 0,
      });

      // Convert files to activity format
      const activity: RecentActivity[] = activityData.files?.map((file: any) => ({
        id: file.id,
        type: file.status === 'completed' ? 'completed' : 
              file.status === 'processing' ? 'processing' : 'upload',
        message: `File "${file.filename}" ${file.status}`,
        timestamp: new Date(file.createdAt),
        fileId: file.id,
      })) || [];

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'camera':
        navigation.navigate('Camera' as never);
        break;
      case 'files':
        navigation.navigate('Files' as never);
        break;
      case 'analytics':
        navigation.navigate('Analytics' as never);
        break;
      case 'upload':
        // Handle document upload
        MobileApiService.pickAndUploadDocument()
          .then(() => {
            Alert.alert('Success', 'Document uploaded successfully');
            loadDashboardData();
          })
          .catch((error) => {
            if (error.message !== 'Document picker cancelled') {
              Alert.alert('Error', 'Failed to upload document');
            }
          });
        break;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return 'cloud-upload';
      case 'processing': return 'hourglass-empty';
      case 'completed': return 'check-circle';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'upload': return colors.primary;
      case 'processing': return colors.warning;
      case 'completed': return colors.success;
      case 'error': return colors.error;
      default: return colors.text;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flex: 1,
    },
    header: {
      padding: 20,
      paddingTop: 10,
    },
    greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 20,
    },
    connectionStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    connectionDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    connectionText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    statsContainer: {
      paddingHorizontal: 20,
      marginBottom: 30,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    statCard: {
      width: (width - 60) / 2,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    quickActionsContainer: {
      paddingHorizontal: 20,
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    quickActionButton: {
      width: (width - 80) / 4,
      aspectRatio: 1,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    quickActionIcon: {
      marginBottom: 8,
    },
    quickActionLabel: {
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
      color: colors.white,
    },
    activityContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    activityList: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      overflow: 'hidden',
    },
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    activityIcon: {
      marginRight: 12,
    },
    activityContent: {
      flex: 1,
    },
    activityMessage: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 2,
    },
    activityTime: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    emptyState: {
      padding: 40,
      alignItems: 'center',
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning! 👋</Text>
          <Text style={styles.subtitle}>Here's what's happening with your files</Text>
          
          {/* Connection Status */}
          <View style={styles.connectionStatus}>
            <View
              style={[
                styles.connectionDot,
                { backgroundColor: isConnected ? colors.success : colors.error }
              ]}
            />
            <Text style={styles.connectionText}>
              {isConnected ? 'Connected' : 'Offline'} • Last update: {formatTimestamp(lastUpdate)}
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalFiles}</Text>
              <Text style={styles.statLabel}>Total Files</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.processingFiles}</Text>
              <Text style={styles.statLabel}>Processing</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.completedToday}</Text>
              <Text style={styles.statLabel}>Completed Today</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.storageUsed}</Text>
              <Text style={styles.statLabel}>Storage Used</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('camera')}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.quickActionButton}
              >
                <Icon
                  name="camera-alt"
                  size={24}
                  color={colors.white}
                  style={styles.quickActionIcon}
                />
                <Text style={styles.quickActionLabel}>Camera</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('upload')}
            >
              <LinearGradient
                colors={[colors.secondary, colors.secondaryDark]}
                style={styles.quickActionButton}
              >
                <Icon
                  name="cloud-upload"
                  size={24}
                  color={colors.white}
                  style={styles.quickActionIcon}
                />
                <Text style={styles.quickActionLabel}>Upload</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('files')}
            >
              <LinearGradient
                colors={[colors.accent, colors.accentDark]}
                style={styles.quickActionButton}
              >
                <Icon
                  name="folder"
                  size={24}
                  color={colors.white}
                  style={styles.quickActionIcon}
                />
                <Text style={styles.quickActionLabel}>Files</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('analytics')}
            >
              <LinearGradient
                colors={[colors.warning, colors.warningDark]}
                style={styles.quickActionButton}
              >
                <Icon
                  name="analytics"
                  size={24}
                  color={colors.white}
                  style={styles.quickActionIcon}
                />
                <Text style={styles.quickActionLabel}>Analytics</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.length > 0 ? (
            <View style={styles.activityList}>
              {recentActivity.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.activityItem,
                    index === recentActivity.length - 1 && { borderBottomWidth: 0 }
                  ]}
                  onPress={() => {
                    if (item.fileId) {
                      navigation.navigate('FileDetail' as never, { fileId: item.fileId } as never);
                    }
                  }}
                >
                  <Icon
                    name={getActivityIcon(item.type)}
                    size={20}
                    color={getActivityColor(item.type)}
                    style={styles.activityIcon}
                  />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityMessage}>{item.message}</Text>
                    <Text style={styles.activityTime}>{formatTimestamp(item.timestamp)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="inbox" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>
                No recent activity.{'\n'}Start by uploading your first file!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen; 
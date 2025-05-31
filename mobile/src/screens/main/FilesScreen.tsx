/**
 * ProofPix Mobile - Files Screen
 * File listing, search, filtering, and management
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  RefreshControl,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { MobileApiService } from '../../services/MobileApiService';

const { width } = Dimensions.get('window');

interface FileItem {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  url?: string;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface FilterOptions {
  status: string;
  mimeType: string;
  sortBy: 'name' | 'date' | 'size';
  sortOrder: 'asc' | 'desc';
}

const FilesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    mimeType: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  useEffect(() => {
    loadFiles(true);
  }, [filters]);

  useEffect(() => {
    filterFiles();
  }, [files, searchQuery]);

  const loadFiles = async (reset = false) => {
    try {
      if (reset) {
        setIsLoading(true);
        setPage(1);
      }

      const currentPage = reset ? 1 : page;
      const params = {
        page: currentPage,
        limit: 20,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.mimeType !== 'all' && { mimeType: filters.mimeType }),
      };

      const response = await MobileApiService.getFiles(params);
      
      if (reset) {
        setFiles(response.files || []);
      } else {
        setFiles(prev => [...prev, ...(response.files || [])]);
      }

      setHasMore(response.files?.length === 20);
      setPage(currentPage + 1);
    } catch (error) {
      console.error('Error loading files:', error);
      Alert.alert('Error', 'Failed to load files');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const filterFiles = useCallback(() => {
    let filtered = [...files];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(file =>
        file.filename.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.filename.localeCompare(b.filename);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredFiles(filtered);
  }, [files, searchQuery, filters]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadFiles(true);
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      loadFiles(false);
    }
  };

  const handleFilePress = (file: FileItem) => {
    if (isSelectionMode) {
      toggleFileSelection(file.id);
    } else {
      navigation.navigate('FileDetail' as never, { fileId: file.id } as never);
    }
  };

  const handleFileLongPress = (file: FileItem) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedFiles([file.id]);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => {
      if (prev.includes(fileId)) {
        const newSelection = prev.filter(id => id !== fileId);
        if (newSelection.length === 0) {
          setIsSelectionMode(false);
        }
        return newSelection;
      } else {
        return [...prev, fileId];
      }
    });
  };

  const selectAllFiles = () => {
    setSelectedFiles(filteredFiles.map(file => file.id));
  };

  const clearSelection = () => {
    setSelectedFiles([]);
    setIsSelectionMode(false);
  };

  const deleteSelectedFiles = async () => {
    Alert.alert(
      'Delete Files',
      `Are you sure you want to delete ${selectedFiles.length} file(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(
                selectedFiles.map(fileId => MobileApiService.deleteFile(fileId))
              );
              
              setFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
              clearSelection();
              Alert.alert('Success', 'Files deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete files');
            }
          },
        },
      ]
    );
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'videocam';
    if (mimeType.includes('pdf')) return 'picture-as-pdf';
    if (mimeType.includes('document') || mimeType.includes('word')) return 'description';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'table-chart';
    return 'insert-drive-file';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'processing': return colors.warning;
      case 'uploading': return colors.primary;
      case 'failed': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const renderFileItem = ({ item }: { item: FileItem }) => (
    <TouchableOpacity
      style={[
        styles.fileItem,
        selectedFiles.includes(item.id) && styles.selectedFileItem
      ]}
      onPress={() => handleFilePress(item)}
      onLongPress={() => handleFileLongPress(item)}
    >
      <View style={styles.fileIcon}>
        {item.thumbnailUrl ? (
          <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
        ) : (
          <Icon
            name={getFileIcon(item.mimeType)}
            size={32}
            color={colors.primary}
          />
        )}
        {isSelectionMode && (
          <View style={styles.selectionIndicator}>
            <Icon
              name={selectedFiles.includes(item.id) ? 'check-circle' : 'radio-button-unchecked'}
              size={20}
              color={selectedFiles.includes(item.id) ? colors.primary : colors.textSecondary}
            />
          </View>
        )}
      </View>

      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={2}>
          {item.filename}
        </Text>
        <View style={styles.fileDetails}>
          <Text style={styles.fileSize}>{formatFileSize(item.size)}</Text>
          <View style={styles.separator} />
          <Text style={styles.fileDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item.status) }
            ]}
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => {
          // Show file options menu
        }}
      >
        <Icon name="more-vert" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter & Sort</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.filterOptions}>
              {['all', 'completed', 'processing', 'uploading', 'failed'].map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterOption,
                    filters.status === status && styles.selectedFilterOption
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, status }))}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.status === status && styles.selectedFilterOptionText
                    ]}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>File Type</Text>
            <View style={styles.filterOptions}>
              {['all', 'image', 'video', 'document'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterOption,
                    filters.mimeType === type && styles.selectedFilterOption
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, mimeType: type }))}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.mimeType === type && styles.selectedFilterOptionText
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Sort By</Text>
            <View style={styles.filterOptions}>
              {[
                { key: 'date', label: 'Date' },
                { key: 'name', label: 'Name' },
                { key: 'size', label: 'Size' }
              ].map(sort => (
                <TouchableOpacity
                  key={sort.key}
                  style={[
                    styles.filterOption,
                    filters.sortBy === sort.key && styles.selectedFilterOption
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, sortBy: sort.key as any }))}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.sortBy === sort.key && styles.selectedFilterOptionText
                    ]}
                  >
                    {sort.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.sortOrderButton}
            onPress={() => setFilters(prev => ({
              ...prev,
              sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
            }))}
          >
            <Icon
              name={filters.sortOrder === 'asc' ? 'arrow-upward' : 'arrow-downward'}
              size={20}
              color={colors.primary}
            />
            <Text style={styles.sortOrderText}>
              {filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      height: 40,
      fontSize: 16,
      color: colors.text,
      marginLeft: 8,
    },
    filterButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.primary,
    },
    selectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: colors.primary,
    },
    selectionText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
    selectionActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectionButton: {
      marginLeft: 16,
    },
    fileList: {
      flex: 1,
    },
    fileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    selectedFileItem: {
      backgroundColor: colors.primaryLight,
    },
    fileIcon: {
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      position: 'relative',
    },
    thumbnail: {
      width: 48,
      height: 48,
      borderRadius: 8,
    },
    selectionIndicator: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: colors.surface,
      borderRadius: 10,
    },
    fileInfo: {
      flex: 1,
    },
    fileName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    fileDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    fileSize: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    separator: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textSecondary,
      marginHorizontal: 8,
    },
    fileDate: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    moreButton: {
      padding: 8,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    filterModal: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 40,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    filterSection: {
      padding: 20,
    },
    filterLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    filterOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    filterOption: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedFilterOption: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterOptionText: {
      fontSize: 14,
      color: colors.text,
    },
    selectedFilterOptionText: {
      color: colors.white,
    },
    sortOrderButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      marginHorizontal: 20,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
    sortOrderText: {
      fontSize: 16,
      color: colors.primary,
      marginLeft: 8,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {isSelectionMode ? (
        <View style={styles.selectionHeader}>
          <Text style={styles.selectionText}>
            {selectedFiles.length} selected
          </Text>
          <View style={styles.selectionActions}>
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={selectAllFiles}
            >
              <Icon name="select-all" size={24} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={deleteSelectedFiles}
            >
              <Icon name="delete" size={24} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={clearSelection}
            >
              <Icon name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search files..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Icon name="filter-list" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        style={styles.fileList}
        data={filteredFiles}
        renderItem={renderFileItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Icon name="folder-open" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'No files match your search' : 'No files yet.\nStart by uploading your first file!'}
              </Text>
            </View>
          ) : null
        }
      />

      {renderFilterModal()}
    </SafeAreaView>
  );
};

export default FilesScreen; 
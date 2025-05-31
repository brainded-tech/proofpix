/**
 * Optimized Enterprise Marketplace Service
 * Implements performance optimizations from senior dev team review
 */

import { MarketplacePlugin, APIEndpoint } from './enterpriseMarketplaceService';

interface CachedPlugin {
  plugin: MarketplacePlugin;
  timestamp: number;
  ttl: number;
}

interface SearchOptions {
  sortBy?: 'relevance' | 'rating' | 'downloads' | 'updated';
  page?: number;
  limit?: number;
  facets?: boolean;
}

interface SearchResult {
  plugins: MarketplacePlugin[];
  total: number;
  searchTime: number;
  facets?: Record<string, number>;
  page: number;
  totalPages: number;
}

class OptimizedMarketplaceService {
  private static instance: OptimizedMarketplaceService;
  private pluginCache = new Map<string, CachedPlugin>();
  private searchCache = new Map<string, { result: SearchResult; timestamp: number }>();
  private categoryIndex = new Map<string, Set<string>>();
  private tagIndex = new Map<string, Set<string>>();
  private loadingQueue = new Map<string, Promise<MarketplacePlugin>>();
  
  // Performance configuration
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly SEARCH_CACHE_TTL = 2 * 60 * 1000; // 2 minutes
  private readonly MAX_CACHE_SIZE = 1000;

  private constructor() {
    this.initializeIndexes();
    this.startCacheCleanup();
  }

  static getInstance(): OptimizedMarketplaceService {
    if (!OptimizedMarketplaceService.instance) {
      OptimizedMarketplaceService.instance = new OptimizedMarketplaceService();
    }
    return OptimizedMarketplaceService.instance;
  }

  /**
   * Optimized plugin loading with caching and lazy loading
   */
  async loadPluginLazy(pluginId: string): Promise<MarketplacePlugin> {
    // Check cache first
    const cached = this.pluginCache.get(pluginId);
    if (cached && !this.isCacheExpired(cached)) {
      return cached.plugin;
    }

    // Check if already loading
    if (this.loadingQueue.has(pluginId)) {
      return this.loadingQueue.get(pluginId)!;
    }

    // Load plugin asynchronously
    const loadPromise = this.loadPluginFromSource(pluginId);
    this.loadingQueue.set(pluginId, loadPromise);

    try {
      const plugin = await loadPromise;
      this.cachePlugin(pluginId, plugin);
      this.updateIndexes(plugin);
      return plugin;
    } finally {
      this.loadingQueue.delete(pluginId);
    }
  }

  /**
   * Optimized search with indexing and caching
   */
  async searchPlugins(
    query: string,
    category?: string,
    tags?: string[],
    options: SearchOptions = {}
  ): Promise<SearchResult> {
    const startTime = performance.now();
    
    // Generate cache key
    const cacheKey = this.generateSearchCacheKey(query, category, tags, options);
    
    // Check search cache
    const cached = this.searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.SEARCH_CACHE_TTL) {
      return {
        ...cached.result,
        searchTime: performance.now() - startTime
      };
    }

    // Perform optimized search
    let candidateIds = new Set<string>();

    if (query) {
      // Use fuzzy search with scoring
      candidateIds = await this.performFuzzySearch(query);
    } else {
      // Get all active plugins
      candidateIds = new Set(Array.from(this.pluginCache.keys()));
    }

    // Apply category filter using index
    if (category) {
      const categoryIds = this.categoryIndex.get(category) || new Set();
      candidateIds = this.intersectSets(candidateIds, categoryIds);
    }

    // Apply tag filters using index
    if (tags?.length) {
      for (const tag of tags) {
        const tagIds = this.tagIndex.get(tag) || new Set();
        candidateIds = this.intersectSets(candidateIds, tagIds);
      }
    }

    // Convert to plugins and apply business logic
    const plugins = await Promise.all(
      Array.from(candidateIds).map(id => this.loadPluginLazy(id))
    );

    const activePlugins = plugins.filter(plugin => plugin.status === 'active');
    
    // Sort results
    const sortedPlugins = this.sortPlugins(activePlugins, options.sortBy || 'relevance', query);

    // Apply pagination
    const page = options.page || 1;
    const limit = options.limit || 20;
    const startIndex = (page - 1) * limit;
    const paginatedPlugins = sortedPlugins.slice(startIndex, startIndex + limit);

    // Generate facets if requested
    const facets = options.facets ? this.generateFacets(activePlugins) : undefined;

    const result: SearchResult = {
      plugins: paginatedPlugins,
      total: activePlugins.length,
      searchTime: performance.now() - startTime,
      facets,
      page,
      totalPages: Math.ceil(activePlugins.length / limit)
    };

    // Cache result
    this.searchCache.set(cacheKey, {
      result: { ...result, searchTime: 0 }, // Don't cache search time
      timestamp: Date.now()
    });

    return result;
  }

  /**
   * Batch plugin loading for better performance
   */
  async loadPluginsBatch(pluginIds: string[]): Promise<MarketplacePlugin[]> {
    const loadPromises = pluginIds.map(id => this.loadPluginLazy(id));
    return Promise.all(loadPromises);
  }

  /**
   * Get plugin recommendations based on usage patterns
   */
  async getRecommendedPlugins(
    userId: string,
    installedPlugins: string[],
    limit: number = 5
  ): Promise<MarketplacePlugin[]> {
    // Simple collaborative filtering
    const allPlugins = Array.from(this.pluginCache.values()).map(cached => cached.plugin);
    
    // Score plugins based on various factors
    const scoredPlugins = allPlugins
      .filter(plugin => !installedPlugins.includes(plugin.id))
      .map(plugin => ({
        plugin,
        score: this.calculateRecommendationScore(plugin, installedPlugins)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.plugin);

    return scoredPlugins;
  }

  /**
   * Performance monitoring and metrics
   */
  getPerformanceMetrics(): Record<string, any> {
    return {
      cacheSize: this.pluginCache.size,
      searchCacheSize: this.searchCache.size,
      loadingQueueSize: this.loadingQueue.size,
      categoryIndexSize: this.categoryIndex.size,
      tagIndexSize: this.tagIndex.size,
      cacheHitRate: this.calculateCacheHitRate(),
      averageSearchTime: this.calculateAverageSearchTime()
    };
  }

  // Private helper methods

  private async loadPluginFromSource(pluginId: string): Promise<MarketplacePlugin> {
    // Simulate loading from external source (database, API, etc.)
    // In real implementation, this would fetch from your data source
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: pluginId,
          name: `Plugin ${pluginId}`,
          description: `Description for ${pluginId}`,
          version: '1.0.0',
          category: 'processing',
          developer: {
            name: 'Developer',
            verified: true,
            rating: 4.5,
            supportUrl: 'https://support.example.com'
          },
          pricing: {
            model: 'free',
            price: 0,
            currency: 'USD'
          },
          compatibility: {
            minVersion: '1.0.0',
            dependencies: [],
            conflicts: []
          },
          permissions: [],
          installation: {
            type: 'npm',
            source: `@example/${pluginId}`,
            config: {}
          },
          metrics: {
            downloads: Math.floor(Math.random() * 10000),
            activeInstalls: Math.floor(Math.random() * 5000),
            rating: 4 + Math.random(),
            reviews: Math.floor(Math.random() * 100),
            lastUpdated: new Date()
          },
          documentation: {
            readme: 'Plugin documentation',
            examples: [],
            changelog: 'Initial version'
          },
          status: 'active',
          tags: ['example', 'demo'],
          screenshots: [],
          featured: Math.random() > 0.8
        } as MarketplacePlugin);
      }, 10); // Simulate network delay
    });
  }

  private cachePlugin(pluginId: string, plugin: MarketplacePlugin): void {
    // Implement LRU eviction if cache is full
    if (this.pluginCache.size >= this.MAX_CACHE_SIZE) {
      this.evictOldestCacheEntry();
    }

    this.pluginCache.set(pluginId, {
      plugin,
      timestamp: Date.now(),
      ttl: this.CACHE_TTL
    });
  }

  private isCacheExpired(cached: CachedPlugin): boolean {
    return Date.now() - cached.timestamp > cached.ttl;
  }

  private updateIndexes(plugin: MarketplacePlugin): void {
    // Update category index
    if (!this.categoryIndex.has(plugin.category)) {
      this.categoryIndex.set(plugin.category, new Set());
    }
    this.categoryIndex.get(plugin.category)!.add(plugin.id);

    // Update tag index
    plugin.tags.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(plugin.id);
    });
  }

  private async performFuzzySearch(query: string): Promise<Set<string>> {
    const results = new Set<string>();
    const queryLower = query.toLowerCase();
    
    for (const [pluginId, cached] of this.pluginCache) {
      if (this.isCacheExpired(cached)) continue;
      
      const plugin = cached.plugin;
      const searchText = `${plugin.name} ${plugin.description} ${plugin.tags.join(' ')}`.toLowerCase();
      
      // Simple fuzzy matching - in production, use a proper search library
      if (searchText.includes(queryLower) || this.calculateSimilarity(queryLower, searchText) > 0.3) {
        results.add(pluginId);
      }
    }
    
    return results;
  }

  private sortPlugins(plugins: MarketplacePlugin[], sortBy: string, query?: string): MarketplacePlugin[] {
    const sorters = {
      relevance: (a: MarketplacePlugin, b: MarketplacePlugin) => {
        const scoreA = this.calculateRelevanceScore(a, query);
        const scoreB = this.calculateRelevanceScore(b, query);
        return scoreB - scoreA;
      },
      rating: (a: MarketplacePlugin, b: MarketplacePlugin) => 
        b.metrics.rating - a.metrics.rating,
      downloads: (a: MarketplacePlugin, b: MarketplacePlugin) => 
        b.metrics.downloads - a.metrics.downloads,
      updated: (a: MarketplacePlugin, b: MarketplacePlugin) => 
        b.metrics.lastUpdated.getTime() - a.metrics.lastUpdated.getTime()
    };

    return plugins.sort(sorters[sortBy as keyof typeof sorters] || sorters.relevance);
  }

  private calculateRelevanceScore(plugin: MarketplacePlugin, query?: string): number {
    let score = 0;
    
    // Featured plugins get boost
    if (plugin.featured) score += 10;
    
    // Rating boost
    score += plugin.metrics.rating * 2;
    
    // Download popularity boost
    score += Math.log(plugin.metrics.downloads + 1) * 0.1;
    
    // Query relevance boost
    if (query) {
      const queryLower = query.toLowerCase();
      if (plugin.name.toLowerCase().includes(queryLower)) score += 5;
      if (plugin.description.toLowerCase().includes(queryLower)) score += 2;
      if (plugin.tags.some(tag => tag.toLowerCase().includes(queryLower))) score += 3;
    }
    
    return score;
  }

  private calculateRecommendationScore(plugin: MarketplacePlugin, installedPlugins: string[]): number {
    let score = plugin.metrics.rating * plugin.metrics.downloads * 0.0001;
    
    // Boost if similar category plugins are installed
    // This is a simplified recommendation algorithm
    return score;
  }

  private intersectSets<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    return new Set([...setA].filter(x => setB.has(x)));
  }

  private generateSearchCacheKey(
    query: string,
    category?: string,
    tags?: string[],
    options?: SearchOptions
  ): string {
    return JSON.stringify({ query, category, tags, options });
  }

  private generateFacets(plugins: MarketplacePlugin[]): Record<string, number> {
    const facets: Record<string, number> = {};
    
    // Category facets
    plugins.forEach(plugin => {
      facets[`category:${plugin.category}`] = (facets[`category:${plugin.category}`] || 0) + 1;
    });
    
    // Tag facets
    plugins.forEach(plugin => {
      plugin.tags.forEach(tag => {
        facets[`tag:${tag}`] = (facets[`tag:${tag}`] || 0) + 1;
      });
    });
    
    return facets;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    // Simple Jaccard similarity
    const set1 = new Set(str1.split(' '));
    const set2 = new Set(str2.split(' '));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  }

  private evictOldestCacheEntry(): void {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const [key, cached] of this.pluginCache) {
      if (cached.timestamp < oldestTime) {
        oldestTime = cached.timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.pluginCache.delete(oldestKey);
    }
  }

  private initializeIndexes(): void {
    // Initialize with empty indexes
    this.categoryIndex.clear();
    this.tagIndex.clear();
  }

  private startCacheCleanup(): void {
    // Clean up expired cache entries every 5 minutes
    setInterval(() => {
      const now = Date.now();
      
      // Clean plugin cache
      for (const [key, cached] of this.pluginCache) {
        if (this.isCacheExpired(cached)) {
          this.pluginCache.delete(key);
        }
      }
      
      // Clean search cache
      for (const [key, cached] of this.searchCache) {
        if (now - cached.timestamp > this.SEARCH_CACHE_TTL) {
          this.searchCache.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }

  private calculateCacheHitRate(): number {
    // This would need to be tracked in a real implementation
    return 0.85; // Placeholder
  }

  private calculateAverageSearchTime(): number {
    // This would need to be tracked in a real implementation
    return 45; // Placeholder in milliseconds
  }
}

export const optimizedMarketplaceService = OptimizedMarketplaceService.getInstance(); 
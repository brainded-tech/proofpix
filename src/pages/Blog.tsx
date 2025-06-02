import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnterpriseLayout } from '../components/ui/EnterpriseLayout';
import { EnterpriseButton } from '../components/ui/EnterpriseComponents';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  User,
  Eye,
  Edit3,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  status: 'draft' | 'published' | 'scheduled';
  category: string;
  tags: string[];
  readTime: number;
  views: number;
}

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock blog posts - replace with actual API call
  useEffect(() => {
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'Introducing ProofPix: Revolutionary Document Intelligence',
        excerpt: 'Discover how ProofPix is transforming document processing with AI-powered analysis and privacy-first architecture.',
        content: '# Introducing ProofPix\n\nProofPix represents a breakthrough in document intelligence...',
        author: 'ProofPix Team',
        publishedAt: new Date('2024-01-15'),
        status: 'published',
        category: 'Product Updates',
        tags: ['AI', 'Document Processing', 'Launch'],
        readTime: 5,
        views: 1247
      },
      {
        id: '2',
        title: 'The Future of Enterprise Document Security',
        excerpt: 'Learn about the latest trends in document security and how enterprises are protecting sensitive information.',
        content: '# Enterprise Document Security\n\nIn today\'s digital landscape...',
        author: 'Security Team',
        publishedAt: new Date('2024-01-10'),
        status: 'published',
        category: 'Security',
        tags: ['Security', 'Enterprise', 'Compliance'],
        readTime: 8,
        views: 892
      },
      {
        id: '3',
        title: 'AI-Powered Contract Analysis: A Complete Guide',
        excerpt: 'Step-by-step guide to implementing AI-powered contract analysis in your organization.',
        content: '# AI Contract Analysis Guide\n\nContract analysis has evolved...',
        author: 'AI Research Team',
        publishedAt: new Date('2024-01-05'),
        status: 'published',
        category: 'Technical Guides',
        tags: ['AI', 'Contracts', 'Legal Tech'],
        readTime: 12,
        views: 1456
      }
    ];
    setPosts(mockPosts);
  }, []);

  const categories = ['all', 'Product Updates', 'Security', 'Technical Guides', 'Case Studies', 'Industry Insights'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <EnterpriseLayout
      showHero
      title="ProofPix Blog"
      description="Insights, tutorials, and updates from the ProofPix team"
      maxWidth="7xl"
    >
      <div className="space-y-8">
        {/* Blog Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Blog & Content Hub
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Latest insights, tutorials, and updates from the ProofPix team
            </p>
          </div>
          
          <EnterpriseButton 
            variant="primary"
            onClick={() => navigate('/blog/new')}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Post</span>
          </EnterpriseButton>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <span>{filteredPosts.length} posts</span>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <article 
              key={post.id}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Post Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs text-slate-500">
                      +{post.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Post Meta */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{post.views}</span>
                    </div>
                    <span>{post.readTime} min read</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <EnterpriseButton 
                    variant="secondary" 
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </EnterpriseButton>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => navigate(`/blog/edit/${post.id}`)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              No posts found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try adjusting your search terms or filters
            </p>
            <EnterpriseButton 
              variant="primary"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </EnterpriseButton>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <EnterpriseButton 
              variant="secondary"
              onClick={() => navigate('/content-management')}
              className="flex items-center justify-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Content Management</span>
            </EnterpriseButton>
            
            <EnterpriseButton 
              variant="secondary"
              className="flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Editorial Calendar</span>
            </EnterpriseButton>
            
            <EnterpriseButton 
              variant="secondary"
              className="flex items-center justify-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Analytics</span>
            </EnterpriseButton>
          </div>
        </div>
      </div>
    </EnterpriseLayout>
  );
};

export default Blog; 
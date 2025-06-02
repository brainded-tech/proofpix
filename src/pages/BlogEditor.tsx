import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EnterpriseLayout } from '../components/ui/EnterpriseLayout';
import { EnterpriseButton } from '../components/ui/EnterpriseComponents';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Settings,
  Calendar,
  Tag,
  User,
  Globe,
  Lock,
  Clock
} from 'lucide-react';

interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt?: Date;
  scheduledAt?: Date;
  status: 'draft' | 'published' | 'scheduled';
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  featuredImage?: string;
  visibility: 'public' | 'private' | 'password';
}

const BlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [post, setPost] = useState<BlogPost>({
    title: '',
    excerpt: '',
    content: '',
    author: 'ProofPix Team',
    status: 'draft',
    category: 'Product Updates',
    tags: [],
    seoTitle: '',
    seoDescription: '',
    visibility: 'public'
  });

  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState('');

  const categories = [
    'Product Updates',
    'Security', 
    'Technical Guides',
    'Case Studies',
    'Industry Insights',
    'Company News'
  ];

  useEffect(() => {
    if (isEditing && id) {
      // Load existing post - replace with actual API call
      const mockPost: BlogPost = {
        id: id,
        title: 'Sample Blog Post',
        excerpt: 'This is a sample excerpt for the blog post.',
        content: '# Sample Blog Post\n\nThis is the content of the blog post...',
        author: 'ProofPix Team',
        status: 'draft',
        category: 'Product Updates',
        tags: ['AI', 'Document Processing'],
        seoTitle: 'Sample Blog Post - ProofPix',
        seoDescription: 'This is a sample blog post description for SEO.',
        visibility: 'public'
      };
      setPost(mockPost);
    }
  }, [isEditing, id]);

  const handleSave = async (status: 'draft' | 'published' | 'scheduled' = post.status) => {
    setIsSaving(true);
    try {
      const updatedPost = {
        ...post,
        status,
        publishedAt: status === 'published' ? new Date() : post.publishedAt,
        seoTitle: post.seoTitle || post.title,
        seoDescription: post.seoDescription || post.excerpt
      };

      // Save post - replace with actual API call
      console.log('Saving post:', updatedPost);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPost(updatedPost);
      
      if (status === 'published') {
        navigate('/blog');
      }
    } catch (error) {
      console.error('Failed to save post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !post.tags.includes(newTag.trim())) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
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
      title={isEditing ? 'Edit Post' : 'Create New Post'}
      description="Create and publish engaging content for your audience"
      maxWidth="7xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <EnterpriseButton
              variant="secondary"
              onClick={() => navigate('/blog')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </EnterpriseButton>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                {post.status}
              </span>
              {post.publishedAt && (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Published {post.publishedAt.toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <EnterpriseButton
              variant="secondary"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </EnterpriseButton>

            <EnterpriseButton
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </EnterpriseButton>

            <EnterpriseButton
              variant="secondary"
              onClick={() => handleSave('draft')}
              disabled={isSaving}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
            </EnterpriseButton>

            <EnterpriseButton
              variant="primary"
              onClick={() => handleSave('published')}
              disabled={isSaving}
              className="flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>Publish</span>
            </EnterpriseButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="Post title..."
                value={post.title}
                onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                className="w-full text-3xl font-bold border-none outline-none bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Excerpt
              </label>
              <textarea
                placeholder="Brief description of your post..."
                value={post.excerpt}
                onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Content
              </label>
              <div className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-700 px-4 py-2 border-b border-slate-300 dark:border-slate-600">
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <span>Markdown supported</span>
                    <span>•</span>
                    <span>Rich text editor</span>
                  </div>
                </div>
                <textarea
                  placeholder="Write your post content here... You can use Markdown formatting."
                  value={post.content}
                  onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                  rows={20}
                  className="w-full px-4 py-3 border-none outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Publish Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Publish Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={post.status}
                    onChange={(e) => setPost(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Visibility
                  </label>
                  <select
                    value={post.visibility}
                    onChange={(e) => setPost(prev => ({ ...prev, visibility: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="password">Password Protected</option>
                  </select>
                </div>

                {post.status === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="datetime-local"
                      value={post.scheduledAt?.toISOString().slice(0, 16) || ''}
                      onChange={(e) => setPost(prev => ({ 
                        ...prev, 
                        scheduledAt: e.target.value ? new Date(e.target.value) : undefined 
                      }))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Categories & Tags */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Categories & Tags
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={post.category}
                    onChange={(e) => setPost(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center space-x-1"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                    />
                    <EnterpriseButton
                      variant="secondary"
                      size="sm"
                      onClick={handleAddTag}
                    >
                      Add
                    </EnterpriseButton>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            {showSettings && (
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  SEO Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      placeholder="SEO optimized title..."
                      value={post.seoTitle}
                      onChange={(e) => setPost(prev => ({ ...prev, seoTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {post.seoTitle.length}/60 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      placeholder="SEO meta description..."
                      value={post.seoDescription}
                      onChange={(e) => setPost(prev => ({ ...prev, seoDescription: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {post.seoDescription.length}/160 characters
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </EnterpriseLayout>
  );
};

export default BlogEditor; 
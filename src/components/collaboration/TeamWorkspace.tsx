import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Eye, 
  Edit, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Filter,
  Search,
  UserPlus,
  Settings,
  Bell,
  Activity,
  FileText,
  Image,
  Download
} from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'online' | 'offline' | 'away';
  lastActive: string;
  permissions: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  assignedTo: string[];
  dueDate?: string;
  progress: number;
  fileCount: number;
  commentCount: number;
  lastActivity: string;
  tags: string[];
}

interface Activity {
  id: string;
  type: 'file_upload' | 'comment' | 'assignment' | 'status_change' | 'share';
  user: TeamMember;
  project: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

interface Comment {
  id: string;
  projectId: string;
  fileId?: string;
  user: TeamMember;
  content: string;
  timestamp: string;
  replies: Comment[];
  mentions: string[];
  attachments: string[];
}

export const TeamWorkspace: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'team' | 'activity'>('projects');
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Fetch team workspace data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Mock data - replace with actual API calls
      const mockTeamMembers: TeamMember[] = [
        {
          id: 'user-001',
          name: 'Sarah Johnson',
          email: 'sarah@company.com',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
          role: 'owner',
          status: 'online',
          lastActive: new Date().toISOString(),
          permissions: ['read', 'write', 'admin', 'invite']
        },
        {
          id: 'user-002',
          name: 'Mike Chen',
          email: 'mike@company.com',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
          role: 'admin',
          status: 'online',
          lastActive: new Date(Date.now() - 300000).toISOString(),
          permissions: ['read', 'write', 'admin']
        },
        {
          id: 'user-003',
          name: 'Emily Rodriguez',
          email: 'emily@company.com',
          role: 'editor',
          status: 'away',
          lastActive: new Date(Date.now() - 1800000).toISOString(),
          permissions: ['read', 'write']
        }
      ];

      const mockProjects: Project[] = [
        {
          id: 'proj-001',
          name: 'Insurance Claim #2024-001',
          description: 'Vehicle damage assessment for comprehensive claim',
          status: 'active',
          priority: 'high',
          createdBy: 'user-001',
          assignedTo: ['user-001', 'user-002'],
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
          progress: 75,
          fileCount: 24,
          commentCount: 8,
          lastActivity: new Date(Date.now() - 3600000).toISOString(),
          tags: ['insurance', 'vehicle', 'urgent']
        },
        {
          id: 'proj-002',
          name: 'Legal Evidence Review',
          description: 'Photo evidence analysis for court case',
          status: 'active',
          priority: 'urgent',
          createdBy: 'user-002',
          assignedTo: ['user-002', 'user-003'],
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          progress: 45,
          fileCount: 156,
          commentCount: 23,
          lastActivity: new Date(Date.now() - 7200000).toISOString(),
          tags: ['legal', 'evidence', 'court']
        },
        {
          id: 'proj-003',
          name: 'Property Inspection Report',
          description: 'Real estate property condition assessment',
          status: 'completed',
          priority: 'medium',
          createdBy: 'user-003',
          assignedTo: ['user-003'],
          progress: 100,
          fileCount: 89,
          commentCount: 12,
          lastActivity: new Date(Date.now() - 86400000).toISOString(),
          tags: ['real-estate', 'inspection']
        }
      ];

      const mockActivities: Activity[] = [
        {
          id: 'act-001',
          type: 'file_upload',
          user: mockTeamMembers[1],
          project: 'proj-001',
          description: 'uploaded 5 new photos to Insurance Claim #2024-001',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'act-002',
          type: 'comment',
          user: mockTeamMembers[0],
          project: 'proj-002',
          description: 'commented on Legal Evidence Review',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 'act-003',
          type: 'status_change',
          user: mockTeamMembers[2],
          project: 'proj-003',
          description: 'marked Property Inspection Report as completed',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      setTeamMembers(mockTeamMembers);
      setProjects(mockProjects);
      setActivities(mockActivities);
      
      analytics.trackFeatureUsage('Team Workspace', 'Workspace Viewed');
    } catch (error) {
      console.error('Failed to fetch team workspace data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: TeamMember['status']) => {
    switch (status) {
      case 'online':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'away':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      case 'offline':
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'file_upload':
        return <Image className="h-4 w-4 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'assignment':
        return <UserPlus className="h-4 w-4 text-purple-500" />;
      case 'status_change':
        return <CheckCircle className="h-4 w-4 text-orange-500" />;
      case 'share':
        return <Share2 className="h-4 w-4 text-pink-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading team workspace...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Workspace</h1>
          <p className="text-gray-600 dark:text-gray-400">Collaborate on projects and manage team activities</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite Member</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Team Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{teamMembers.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {teamMembers.filter(m => m.status === 'online').length} online
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {projects.filter(p => p.status === 'active').length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {projects.filter(p => p.priority === 'urgent').length} urgent
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Files</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {projects.reduce((sum, p) => sum + p.fileCount, 0)}
              </p>
            </div>
            <Image className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Across all projects
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Comments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {projects.reduce((sum, p) => sum + p.commentCount, 0)}
              </p>
            </div>
            <MessageSquare className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Team discussions
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'projects'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 mr-2 inline" />
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'team'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Users className="h-4 w-4 mr-2 inline" />
            Team ({teamMembers.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'activity'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Activity className="h-4 w-4 mr-2 inline" />
            Activity ({activities.length})
          </button>
        </nav>
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <>
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Projects</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredProjects.length} of {projects.length} projects
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                        {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Image className="h-4 w-4 mr-1" />
                      {project.fileCount} files
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {project.commentCount} comments
                    </div>
                  </div>

                  {/* Assigned Team Members */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex -space-x-2">
                      {project.assignedTo.slice(0, 3).map((userId) => {
                        const member = teamMembers.find(m => m.id === userId);
                        return member ? (
                          <div
                            key={member.id}
                            className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300 border-2 border-white dark:border-gray-800"
                            title={member.name}
                          >
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              member.name.charAt(0).toUpperCase()
                            )}
                          </div>
                        ) : null;
                      })}
                      {project.assignedTo.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 border-2 border-white dark:border-gray-800">
                          +{project.assignedTo.length - 3}
                        </div>
                      )}
                    </div>
                    {project.dueDate && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(project.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Updated {new Date(project.lastActivity).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                        title="View Project"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400"
                        title="Share Project"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            member.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        member.role === 'owner' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' :
                        member.role === 'admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                        member.role === 'editor' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                      }`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(member.status)}
                        <span className="ml-2 text-sm text-gray-900 dark:text-white">
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(member.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                          title="View Profile"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400"
                          title="Edit Permissions"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.user.name}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.description}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 
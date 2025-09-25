import React, { useState, useEffect } from 'react';
import { Users, Calendar, Clock, MapPin, Star, Filter, Search, Plus, Eye, MessageSquare } from 'lucide-react';
import { useAuth } from '@consulting19/shared';

interface CrossAssignment {
  id: string;
  title: string;
  description: string;
  client_name: string;
  location: string;
  start_date: string;
  end_date: string;
  duration: string;
  status: 'available' | 'applied' | 'assigned' | 'completed' | 'cancelled';
  required_skills: string[];
  compensation: number;
  urgency: 'low' | 'medium' | 'high';
  team_size: number;
  lead_consultant: string;
  applications_count: number;
  rating?: number;
}

interface Application {
  id: string;
  assignment_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  applied_date: string;
  message: string;
}

const ConsultantCrossAssignments: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<CrossAssignment[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedTab, setSelectedTab] = useState<'available' | 'my-applications' | 'my-assignments'>('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockAssignments: CrossAssignment[] = [
      {
        id: '1',
        title: 'Digital Transformation Project',
        description: 'Lead a comprehensive digital transformation initiative for a mid-size manufacturing company.',
        client_name: 'TechCorp Industries',
        location: 'New York, NY',
        start_date: '2024-02-15',
        end_date: '2024-05-15',
        duration: '3 months',
        status: 'available',
        required_skills: ['Digital Strategy', 'Change Management', 'Project Management'],
        compensation: 15000,
        urgency: 'high',
        team_size: 4,
        lead_consultant: 'Sarah Johnson',
        applications_count: 8
      },
      {
        id: '2',
        title: 'Market Research Analysis',
        description: 'Conduct comprehensive market research for new product launch in European markets.',
        client_name: 'Global Ventures Ltd',
        location: 'London, UK',
        start_date: '2024-03-01',
        end_date: '2024-04-30',
        duration: '2 months',
        status: 'applied',
        required_skills: ['Market Research', 'Data Analysis', 'Strategic Planning'],
        compensation: 12000,
        urgency: 'medium',
        team_size: 3,
        lead_consultant: 'Michael Chen',
        applications_count: 5
      },
      {
        id: '3',
        title: 'Financial Restructuring',
        description: 'Support financial restructuring and optimization for a growing startup.',
        client_name: 'StartupX',
        location: 'San Francisco, CA',
        start_date: '2024-01-20',
        end_date: '2024-03-20',
        duration: '2 months',
        status: 'assigned',
        required_skills: ['Financial Analysis', 'Business Strategy', 'Risk Management'],
        compensation: 18000,
        urgency: 'high',
        team_size: 2,
        lead_consultant: 'David Wilson',
        applications_count: 12,
        rating: 4.8
      }
    ];

    const mockApplications: Application[] = [
      {
        id: '1',
        assignment_id: '2',
        status: 'pending',
        applied_date: '2024-01-10',
        message: 'I have extensive experience in market research and would love to contribute to this project.'
      }
    ];

    setAssignments(mockAssignments);
    setApplications(mockApplications);
    setLoading(false);
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'applied':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'assigned':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'completed':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = !selectedSkill || assignment.required_skills.includes(selectedSkill);
    const matchesUrgency = !selectedUrgency || assignment.urgency === selectedUrgency;
    
    if (selectedTab === 'available') {
      return assignment.status === 'available' && matchesSearch && matchesSkill && matchesUrgency;
    } else if (selectedTab === 'my-applications') {
      return assignment.status === 'applied' && matchesSearch && matchesSkill && matchesUrgency;
    } else {
      return assignment.status === 'assigned' && matchesSearch && matchesSkill && matchesUrgency;
    }
  });

  const allSkills = Array.from(new Set(assignments.flatMap(a => a.required_skills)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cross Assignments</h1>
          <p className="text-gray-600">Collaborate with other consultants on exciting projects</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Assignment</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('available')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'available'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Available Assignments
          </button>
          <button
            onClick={() => setSelectedTab('my-applications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'my-applications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Applications
          </button>
          <button
            onClick={() => setSelectedTab('my-assignments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'my-assignments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Assignments
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Skills</option>
            {allSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>

          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Urgency Levels</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{assignment.description}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
                  {assignment.status}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(assignment.urgency)}`}>
                  {assignment.urgency} priority
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>{assignment.client_name}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{assignment.location}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(assignment.start_date)} - {formatDate(assignment.end_date)}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{assignment.duration} • {assignment.team_size} team members</span>
              </div>

              {assignment.rating && (
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>{assignment.rating}/5.0 rating</span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
              <div className="flex flex-wrap gap-2">
                {assignment.required_skills.map((skill, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(assignment.compensation)}</p>
                <p className="text-sm text-gray-600">{assignment.applications_count} applications</p>
              </div>
              
              <div className="flex space-x-2">
                <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                
                {assignment.status === 'available' && (
                  <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Apply
                  </button>
                )}
                
                {assignment.status === 'applied' && (
                  <button className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                )}
                
                {assignment.status === 'assigned' && (
                  <button className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Continue
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-600">Try adjusting your filters or check back later for new opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default ConsultantCrossAssignments;
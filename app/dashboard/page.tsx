import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { ProjectCard } from '@/components/dashboard/project-card'
import { TaskList } from '@/components/dashboard/task-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, Users, SquareCheck as CheckSquare, Clock } from 'lucide-react'

// Mock data - in real app this would come from API
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
  org_id: '1',
  role: 'admin' as const,
  created_at: new Date()
}

const mockOrganization = {
  name: 'Acme Corp'
}

const mockProjects = [
  {
    id: '1',
    workspace_id: '1',
    name: 'Website Redesign',
    key: 'WEB',
    description: 'Complete overhaul of the company website with modern design and improved UX',
    status: 'active' as const,
    start_date: new Date('2024-01-01'),
    end_date: new Date('2024-03-31'),
    visibility: 'internal' as const,
    created_by: '1',
    created_at: new Date(),
    members: [
      { id: '1', project_id: '1', user_id: '1', role: 'pm' as const, user: mockUser },
      { id: '2', project_id: '1', user_id: '2', role: 'contributor' as const, user: { ...mockUser, id: '2', name: 'Jane Smith' } },
    ]
  },
  {
    id: '2',
    workspace_id: '1',
    name: 'Mobile App',
    key: 'MOB',
    description: 'Native mobile application for iOS and Android platforms',
    status: 'planning' as const,
    start_date: new Date('2024-02-01'),
    end_date: new Date('2024-06-30'),
    visibility: 'internal' as const,
    created_by: '1',
    created_at: new Date(),
    members: [
      { id: '3', project_id: '2', user_id: '1', role: 'pm' as const, user: mockUser },
    ]
  }
]

const mockTasks = [
  {
    id: '1',
    project_id: 'WEB',
    board_id: '1',
    column_id: '1',
    title: 'Design homepage mockups',
    description: 'Create high-fidelity mockups for the new homepage design',
    type: 'task' as const,
    status: 'in_progress' as const,
    priority: 'high' as const,
    due_date: new Date('2024-01-15'),
    created_by: '1',
    assignee_id: '1',
    sort_order: 1,
    archived: false,
    created_at: new Date(),
    assignee: mockUser
  },
  {
    id: '2',
    project_id: 'WEB',
    board_id: '1',
    column_id: '1',
    title: 'Set up development environment',
    description: 'Configure local development setup with all necessary tools',
    type: 'task' as const,
    status: 'todo' as const,
    priority: 'medium' as const,
    due_date: new Date('2024-01-20'),
    created_by: '1',
    assignee_id: '2',
    sort_order: 2,
    archived: false,
    created_at: new Date(),
    assignee: { ...mockUser, id: '2', name: 'Jane Smith' }
  }
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar user={mockUser} organization={mockOrganization} />
      
      <div className="flex">
        <Sidebar className="hidden md:block border-r" />
        
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here&apos;s what&apos;s happening with your projects.
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Projects
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Team Members
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    +3 new this week
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tasks Completed
                  </CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last week
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Overdue Tasks
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    -2 from yesterday
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Recent Projects */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recent Projects</h2>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {mockProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>

              {/* My Tasks */}
              <div>
                <TaskList 
                  tasks={mockTasks} 
                  title="My Tasks"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { ProjectCard } from '@/components/dashboard/project-card'
import { Button } from '@/components/ui/button'
import { Plus, Search, ListFilter as Filter } from 'lucide-react'

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
      { id: '3', project_id: '1', user_id: '3', role: 'contributor' as const, user: { ...mockUser, id: '3', name: 'Bob Wilson' } },
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
      { id: '4', project_id: '2', user_id: '1', role: 'pm' as const, user: mockUser },
      { id: '5', project_id: '2', user_id: '4', role: 'contributor' as const, user: { ...mockUser, id: '4', name: 'Alice Johnson' } },
    ]
  },
  {
    id: '3',
    workspace_id: '1',
    name: 'API Integration',
    key: 'API',
    description: 'Integrate third-party APIs for enhanced functionality',
    status: 'on_hold' as const,
    start_date: new Date('2024-03-01'),
    end_date: new Date('2024-05-31'),
    visibility: 'internal' as const,
    created_by: '1',
    created_at: new Date(),
    members: [
      { id: '6', project_id: '3', user_id: '1', role: 'pm' as const, user: mockUser },
    ]
  },
  {
    id: '4',
    workspace_id: '1',
    name: 'Data Analytics Dashboard',
    key: 'DASH',
    description: 'Build comprehensive analytics dashboard for business insights',
    status: 'completed' as const,
    start_date: new Date('2023-10-01'),
    end_date: new Date('2023-12-31'),
    visibility: 'internal' as const,
    created_by: '1',
    created_at: new Date(),
    members: [
      { id: '7', project_id: '4', user_id: '1', role: 'pm' as const, user: mockUser },
      { id: '8', project_id: '4', user_id: '2', role: 'contributor' as const, user: { ...mockUser, id: '2', name: 'Jane Smith' } },
      { id: '9', project_id: '4', user_id: '5', role: 'contributor' as const, user: { ...mockUser, id: '5', name: 'Mike Davis' } },
    ]
  }
]

export default function ProjectsPage() {
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
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <p className="text-muted-foreground">
                  Manage and track all your projects in one place.
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search projects..."
                  className="h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Empty State (if no projects) */}
            {mockProjects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mx-auto max-w-md">
                  <h3 className="text-lg font-semibold">No projects yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Get started by creating your first project.
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { Card, CardContent } from '@/components/ui/card'

const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
}

const mockOrganization = {
  name: 'Acme Corp'
}

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar user={mockUser} organization={mockOrganization} />

      <div className="flex">
        <Sidebar className="hidden md:block border-r" />

        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
              <p className="text-muted-foreground">
                Analytics and insights for your projects and team performance.
              </p>
            </div>

            <Card>
              <CardContent className="p-12">
                <div className="text-center text-muted-foreground">
                  <p>Reports and analytics coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

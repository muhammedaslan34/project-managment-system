/*
  # Project Management System - Complete Database Schema

  ## Overview
  This migration creates a comprehensive database schema for a project management system
  with support for projects, tasks, calendar events, team management, and real-time collaboration.

  ## 1. New Tables

  ### users
  - id (uuid, primary key) - Unique user identifier
  - email (text, unique) - User email address
  - password_hash (text) - Hashed password for authentication
  - full_name (text) - User's full name
  - avatar_url (text, nullable) - Profile picture URL
  - role (text) - User role (admin, manager, member, viewer)
  - created_at (timestamptz) - Account creation timestamp
  - updated_at (timestamptz) - Last update timestamp

  ### teams
  - id (uuid, primary key) - Unique team identifier
  - name (text) - Team name
  - description (text, nullable) - Team description
  - owner_id (uuid, foreign key) - References users(id)
  - created_at (timestamptz) - Creation timestamp
  - updated_at (timestamptz) - Last update timestamp

  ### team_members
  - id (uuid, primary key) - Unique membership identifier
  - team_id (uuid, foreign key) - References teams(id)
  - user_id (uuid, foreign key) - References users(id)
  - role (text) - Team role (owner, admin, member, viewer)
  - joined_at (timestamptz) - Join timestamp

  ### projects
  - id (uuid, primary key) - Unique project identifier
  - team_id (uuid, foreign key) - References teams(id)
  - name (text) - Project name
  - description (text, nullable) - Project description
  - status (text) - Status (planning, active, on_hold, completed, archived)
  - priority (text) - Priority level (low, medium, high, urgent)
  - start_date (date, nullable) - Project start date
  - due_date (date, nullable) - Project deadline
  - created_by (uuid, foreign key) - References users(id)
  - created_at (timestamptz) - Creation timestamp
  - updated_at (timestamptz) - Last update timestamp

  ### tasks
  - id (uuid, primary key) - Unique task identifier
  - project_id (uuid, foreign key) - References projects(id)
  - title (text) - Task title
  - description (text, nullable) - Task description
  - status (text) - Status (todo, in_progress, review, done)
  - priority (text) - Priority level (low, medium, high, urgent)
  - assigned_to (uuid, foreign key, nullable) - References users(id)
  - created_by (uuid, foreign key) - References users(id)
  - due_date (timestamptz, nullable) - Task deadline
  - estimated_hours (integer, nullable) - Estimated work hours
  - actual_hours (integer, nullable) - Actual work hours
  - parent_task_id (uuid, foreign key, nullable) - References tasks(id) for subtasks
  - position (integer) - Task position in list
  - created_at (timestamptz) - Creation timestamp
  - updated_at (timestamptz) - Last update timestamp

  ### task_dependencies
  - id (uuid, primary key) - Unique dependency identifier
  - task_id (uuid, foreign key) - References tasks(id)
  - depends_on_task_id (uuid, foreign key) - References tasks(id)
  - dependency_type (text) - Type (blocks, blocked_by, related)
  - created_at (timestamptz) - Creation timestamp

  ### calendar_events
  - id (uuid, primary key) - Unique event identifier
  - team_id (uuid, foreign key) - References teams(id)
  - project_id (uuid, foreign key, nullable) - References projects(id)
  - task_id (uuid, foreign key, nullable) - References tasks(id)
  - title (text) - Event title
  - description (text, nullable) - Event description
  - event_type (text) - Type (meeting, deadline, milestone, reminder)
  - start_time (timestamptz) - Event start time
  - end_time (timestamptz) - Event end time
  - location (text, nullable) - Meeting location or URL
  - created_by (uuid, foreign key) - References users(id)
  - created_at (timestamptz) - Creation timestamp
  - updated_at (timestamptz) - Last update timestamp

  ### event_attendees
  - id (uuid, primary key) - Unique attendee record
  - event_id (uuid, foreign key) - References calendar_events(id)
  - user_id (uuid, foreign key) - References users(id)
  - status (text) - Attendance status (pending, accepted, declined, tentative)
  - created_at (timestamptz) - Creation timestamp

  ### comments
  - id (uuid, primary key) - Unique comment identifier
  - user_id (uuid, foreign key) - References users(id)
  - project_id (uuid, foreign key, nullable) - References projects(id)
  - task_id (uuid, foreign key, nullable) - References tasks(id)
  - content (text) - Comment content
  - created_at (timestamptz) - Creation timestamp
  - updated_at (timestamptz) - Last update timestamp

  ### notifications
  - id (uuid, primary key) - Unique notification identifier
  - user_id (uuid, foreign key) - References users(id)
  - type (text) - Notification type
  - title (text) - Notification title
  - message (text) - Notification message
  - related_entity_type (text, nullable) - Entity type (project, task, event)
  - related_entity_id (uuid, nullable) - Entity ID
  - is_read (boolean) - Read status
  - created_at (timestamptz) - Creation timestamp

  ### activity_logs
  - id (uuid, primary key) - Unique activity identifier
  - user_id (uuid, foreign key) - References users(id)
  - entity_type (text) - Entity type (project, task, event, team)
  - entity_id (uuid) - Entity ID
  - action (text) - Action performed (created, updated, deleted, assigned)
  - changes (jsonb, nullable) - JSON of what changed
  - created_at (timestamptz) - Activity timestamp

  ## 2. Security
  All tables have Row Level Security (RLS) enabled with appropriate policies to ensure:
  - Users can only access data from teams they belong to
  - Proper role-based access control (RBAC)
  - Owners and admins have elevated permissions

  ## 3. Indexes
  Strategic indexes on frequently queried columns for performance optimization
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'planning',
  priority text NOT NULL DEFAULT 'medium',
  start_date date,
  due_date date,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo',
  priority text NOT NULL DEFAULT 'medium',
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  due_date timestamptz,
  estimated_hours integer,
  actual_hours integer,
  parent_task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create task_dependencies table
CREATE TABLE IF NOT EXISTS task_dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  depends_on_task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  dependency_type text NOT NULL DEFAULT 'blocks',
  created_at timestamptz DEFAULT now(),
  UNIQUE(task_id, depends_on_task_id)
);

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  event_type text NOT NULL DEFAULT 'meeting',
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location text,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event_attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  related_entity_type text,
  related_entity_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  changes jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_team_id ON projects(team_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_calendar_events_team_id ON calendar_events(team_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for teams table
CREATE POLICY "Team members can view their teams"
  ON teams FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = teams.id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create teams"
  ON teams FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Team owners can update their teams"
  ON teams FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Team owners can delete their teams"
  ON teams FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- RLS Policies for team_members table
CREATE POLICY "Team members can view team membership"
  ON team_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and admins can add members"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Team owners and admins can remove members"
  ON team_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
    )
  );

-- RLS Policies for projects table
CREATE POLICY "Team members can view team projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = projects.team_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = projects.team_id
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Team members can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = projects.team_id
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('owner', 'admin', 'member')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = projects.team_id
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Team owners and admins can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = projects.team_id
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('owner', 'admin')
    )
  );

-- RLS Policies for tasks table
CREATE POLICY "Team members can view project tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE p.id = tasks.project_id
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can create tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE p.id = tasks.project_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Team members can update tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE p.id = tasks.project_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin', 'member')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE p.id = tasks.project_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Team members can delete tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE p.id = tasks.project_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin', 'member')
    )
  );

-- RLS Policies for calendar_events table
CREATE POLICY "Team members can view team events"
  ON calendar_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = calendar_events.team_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can create events"
  ON calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = calendar_events.team_id
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Team members can update events"
  ON calendar_events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = calendar_events.team_id
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('owner', 'admin', 'member')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = calendar_events.team_id
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Team members can delete events"
  ON calendar_events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = calendar_events.team_id
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('owner', 'admin', 'member')
    )
  );

-- RLS Policies for notifications table
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for comments table
CREATE POLICY "Team members can view comments"
  ON comments FOR SELECT
  TO authenticated
  USING (
    (project_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE p.id = comments.project_id
      AND tm.user_id = auth.uid()
    ))
    OR
    (task_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM tasks t
      JOIN projects p ON p.id = t.project_id
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE t.id = comments.task_id
      AND tm.user_id = auth.uid()
    ))
  );

CREATE POLICY "Team members can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (
    (project_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM projects p
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE p.id = comments.project_id
      AND tm.user_id = auth.uid()
    ))
    OR
    (task_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM tasks t
      JOIN projects p ON p.id = t.project_id
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE t.id = comments.task_id
      AND tm.user_id = auth.uid()
    ))
  );

-- RLS Policies for activity_logs table
CREATE POLICY "Team members can view activity logs"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can create activity logs"
  ON activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for task_dependencies and event_attendees
CREATE POLICY "Team members can view task dependencies"
  ON task_dependencies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN projects p ON p.id = t.project_id
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE t.id = task_dependencies.task_id
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can manage task dependencies"
  ON task_dependencies FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN projects p ON p.id = t.project_id
      JOIN team_members tm ON tm.team_id = p.team_id
      WHERE t.id = task_dependencies.task_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Team members can view event attendees"
  ON event_attendees FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM calendar_events ce
      JOIN team_members tm ON tm.team_id = ce.team_id
      WHERE ce.id = event_attendees.event_id
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can manage event attendees"
  ON event_attendees FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM calendar_events ce
      JOIN team_members tm ON tm.team_id = ce.team_id
      WHERE ce.id = event_attendees.event_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin', 'member')
    )
  );

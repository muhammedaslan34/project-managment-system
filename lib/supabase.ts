import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          full_name: string;
          avatar_url: string | null;
          role: 'admin' | 'manager' | 'member' | 'viewer';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      teams: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['teams']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['teams']['Insert']>;
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member' | 'viewer';
          joined_at: string;
        };
        Insert: Omit<Database['public']['Tables']['team_members']['Row'], 'id' | 'joined_at'>;
        Update: Partial<Database['public']['Tables']['team_members']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          team_id: string;
          name: string;
          description: string | null;
          status: 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          start_date: string | null;
          due_date: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: 'todo' | 'in_progress' | 'review' | 'done';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          assigned_to: string | null;
          created_by: string;
          due_date: string | null;
          estimated_hours: number | null;
          actual_hours: number | null;
          parent_task_id: string | null;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>;
      };
      task_dependencies: {
        Row: {
          id: string;
          task_id: string;
          depends_on_task_id: string;
          dependency_type: 'blocks' | 'blocked_by' | 'related';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['task_dependencies']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['task_dependencies']['Insert']>;
      };
      calendar_events: {
        Row: {
          id: string;
          team_id: string;
          project_id: string | null;
          task_id: string | null;
          title: string;
          description: string | null;
          event_type: 'meeting' | 'deadline' | 'milestone' | 'reminder';
          start_time: string;
          end_time: string;
          location: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['calendar_events']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['calendar_events']['Insert']>;
      };
      event_attendees: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: 'pending' | 'accepted' | 'declined' | 'tentative';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['event_attendees']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['event_attendees']['Insert']>;
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          task_id: string | null;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['comments']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          related_entity_type: string | null;
          related_entity_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          entity_type: string;
          entity_id: string;
          action: string;
          changes: any;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['activity_logs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['activity_logs']['Insert']>;
      };
    };
  };
};

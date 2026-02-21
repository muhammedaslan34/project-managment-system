import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export function subscribeToProject(projectId: string, callback: (payload: any) => void): RealtimeChannel {
  return supabase
    .channel(`project:${projectId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'projects',
        filter: `id=eq.${projectId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToProjectTasks(projectId: string, callback: (payload: any) => void): RealtimeChannel {
  return supabase
    .channel(`project-tasks:${projectId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `project_id=eq.${projectId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToTask(taskId: string, callback: (payload: any) => void): RealtimeChannel {
  return supabase
    .channel(`task:${taskId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `id=eq.${taskId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToTeamEvents(teamId: string, callback: (payload: any) => void): RealtimeChannel {
  return supabase
    .channel(`team-events:${teamId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'calendar_events',
        filter: `team_id=eq.${teamId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToUserNotifications(userId: string, callback: (payload: any) => void): RealtimeChannel {
  return supabase
    .channel(`user-notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToComments(
  entityType: 'project' | 'task',
  entityId: string,
  callback: (payload: any) => void
): RealtimeChannel {
  const filter = entityType === 'project' ? `project_id=eq.${entityId}` : `task_id=eq.${entityId}`;

  return supabase
    .channel(`comments-${entityType}:${entityId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter,
      },
      callback
    )
    .subscribe();
}

export function unsubscribe(channel: RealtimeChannel): void {
  supabase.removeChannel(channel);
}

import { pool } from '../db.js';

export async function createMeetingReminderNotification(meeting) {
  try {
    const { consultant_id, start_time, title, id } = meeting;
    
    const reminderTime = new Date(start_time);
    reminderTime.setHours(reminderTime.getHours() - 24);
    
    const now = new Date();
    
    if (reminderTime <= now) {
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, message, related_meeting_id, action_url)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          consultant_id,
          'meeting_reminder',
          'Upcoming Meeting Reminder',
          `You have a meeting "${title}" scheduled for ${new Date(start_time).toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}`,
          id,
          `/meetings/${id}`
        ]
      );
      
      console.log(`✅ Meeting reminder notification created for consultant ${consultant_id}`);
    } else {
      console.log(`⏰ Meeting reminder scheduled for ${reminderTime.toISOString()}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating meeting reminder notification:', error);
    return false;
  }
}

export async function createNotification({ user_id, type, title, message, related_meeting_id, related_project_id, related_order_id, action_url }) {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, related_meeting_id, related_project_id, related_order_id, action_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [user_id, type, title, message, related_meeting_id || null, related_project_id || null, related_order_id || null, action_url || null]
    );
    
    console.log(`✅ Notification created for user ${user_id}: ${title}`);
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
}

import { supabase } from '@/config/supabase';

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
}

/**
 * Send a push notification to a specific user
 */
export const sendNotificationToUser = async (
  userId: string,
  notification: NotificationData
) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: {
        user_id: userId,
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
      },
    });

    if (error) {
      console.error('Error sending notification:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send notification:', error);
    throw error;
  }
};

/**
 * Send push notifications to multiple users
 */
export const sendBulkNotification = async (
  userIds: string[],
  notification: NotificationData
) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-bulk-notification', {
      body: {
        user_ids: userIds,
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
      },
    });

    if (error) {
      console.error('Error sending bulk notification:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send bulk notification:', error);
    throw error;
  }
};

/**
 * Send a workout reminder notification
 */
export const sendWorkoutReminder = async (userId: string) => {
  return sendNotificationToUser(userId, {
    title: 'Time to Work Out! 💪',
    body: 'Your body is ready for a great workout session. Let\'s crush those goals!',
    data: {
      type: 'workout_reminder',
      screen: 'workouts',
    },
  });
};

/**
 * Send a streak milestone notification
 */
export const sendStreakMilestone = async (userId: string, streakDays: number) => {
  return sendNotificationToUser(userId, {
    title: `🔥 ${streakDays} Day Streak!`,
    body: `Amazing! You've been working out for ${streakDays} days in a row. Keep up the great work!`,
    data: {
      type: 'streak_milestone',
      streak_days: streakDays,
      screen: 'progress',
    },
  });
};

/**
 * Send an achievement unlocked notification
 */
export const sendAchievementUnlocked = async (userId: string, achievementName: string) => {
  return sendNotificationToUser(userId, {
    title: '🏆 Achievement Unlocked!',
    body: `Congratulations! You've earned the "${achievementName}" achievement.`,
    data: {
      type: 'achievement_unlocked',
      achievement_name: achievementName,
      screen: 'progress',
    },
  });
};

/**
 * Send a goal completion notification
 */
export const sendGoalCompleted = async (userId: string, goalName: string) => {
  return sendNotificationToUser(userId, {
    title: '🎯 Goal Completed!',
    body: `Fantastic! You've reached your goal: "${goalName}". Time to set a new one!`,
    data: {
      type: 'goal_completed',
      goal_name: goalName,
      screen: 'goals',
    },
  });
};

/**
 * Send a workout completion notification
 */
export const sendWorkoutCompleted = async (userId: string, userName: string, workoutName: string, duration: number, calories: number) => {
  const durationMinutes = Math.round(duration / 60);
  const workoutDisplayName = workoutName || 'Workout';
  
  return sendNotificationToUser(userId, {
    title: `🎉 Great job, ${userName}!`,
    body: `You completed your ${workoutDisplayName} in ${durationMinutes} minutes and burned ${calories} calories!`,
    data: {
      type: 'workout_completed',
      workout_name: workoutDisplayName,
      duration_minutes: durationMinutes,
      calories_burned: calories,
      screen: 'progress',
    },
  });
}; 
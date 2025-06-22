import InfoPage, { InfoStyles } from "@/components/InfoPage";
import React from "react";
import { Text } from "react-native";

const HelpScreen = () => {
  return (
    <InfoPage title="Help & Support">
      <Text style={InfoStyles.heading}>Frequently Asked Questions</Text>
      <Text style={InfoStyles.paragraph}>
        Here you'll find answers to common questions about using the app,
        managing your account, and tracking your progress.
      </Text>

      <Text style={InfoStyles.heading}>How do I track a workout?</Text>
      <Text style={InfoStyles.paragraph}>
        Navigate to the 'Workouts' tab, select a workout template or start an
        empty workout, and press the 'Start' button.
      </Text>

      <Text style={InfoStyles.heading}>How is my progress calculated?</Text>
      <Text style={InfoStyles.paragraph}>
        Your progress is based on your completed workouts, including duration,
        calories burned, and consistency. Achievements are unlocked as you reach
        specific milestones.
      </Text>

      <Text style={InfoStyles.heading}>Contact Us</Text>
      <Text style={InfoStyles.paragraph}>
        If you can't find the answer you're looking for, please email us at
        support@fitnessapp.com. We're here to help!
      </Text>
    </InfoPage>
  );
};

export default HelpScreen;

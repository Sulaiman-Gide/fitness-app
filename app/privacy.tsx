import InfoPage, { InfoStyles } from "@/components/InfoPage";
import React from "react";
import { Text } from "react-native";

const PrivacyScreen = () => {
  return (
    <InfoPage title="Privacy Policy">
      <Text style={InfoStyles.paragraph}>
        Your privacy is important to us. It is our policy to respect your
        privacy regarding any information we may collect from you across our
        app.
      </Text>

      <Text style={InfoStyles.heading}>Information We Collect</Text>
      <Text style={InfoStyles.paragraph}>
        We only ask for personal information when we truly need it to provide a
        service to you. We collect it by fair and lawful means, with your
        knowledge and consent. We also let you know why we're collecting it and
        how it will be used.
      </Text>

      <Text style={InfoStyles.heading}>How We Use Your Information</Text>
      <Text style={InfoStyles.paragraph}>
        We use the information we collect to operate, maintain, and provide you
        the features and functionality of the app, as well as to communicate
        directly with you, such as to send you email messages and push
        notifications.
      </Text>

      <Text style={InfoStyles.heading}>Security</Text>
      <Text style={InfoStyles.paragraph}>
        We take security seriously and take reasonable measures to protect your
        information. However, no method of transmission over the Internet or
        method of electronic storage is 100% secure.
      </Text>
    </InfoPage>
  );
};

export default PrivacyScreen;

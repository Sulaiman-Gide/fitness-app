import InfoPage, { InfoStyles } from "@/components/InfoPage";
import React from "react";
import { Text } from "react-native";

const TermsScreen = () => {
  return (
    <InfoPage title="Terms of Service">
      <Text style={InfoStyles.paragraph}>
        By downloading or using the app, these terms will automatically apply to
        you – you should make sure therefore that you read them carefully before
        using the app.
      </Text>

      <Text style={InfoStyles.heading}>Usage License</Text>
      <Text style={InfoStyles.paragraph}>
        Permission is granted to temporarily download one copy of the app for
        personal, non-commercial transitory viewing only. This is the grant of a
        license, not a transfer of title.
      </Text>

      <Text style={InfoStyles.heading}>Disclaimer</Text>
      <Text style={InfoStyles.paragraph}>
        The materials within this app are provided on an 'as is' basis. We make
        no warranties, expressed or implied, and hereby disclaim and negate all
        other warranties including, without limitation, implied warranties or
        conditions of merchantability, fitness for a particular purpose, or
        non-infringement of intellectual property or other violation of rights.
      </Text>

      <Text style={InfoStyles.heading}>Limitations</Text>
      <Text style={InfoStyles.paragraph}>
        In no event shall we or our suppliers be liable for any damages
        (including, without limitation, damages for loss of data or profit, or
        due to business interruption) arising out of the use or inability to use
        the materials on our app.
      </Text>
    </InfoPage>
  );
};

export default TermsScreen;

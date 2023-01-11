// React Native Card View for Android and IOS
// https://aboutreact.com/react-native-card-view/

// import React in our code
import React from 'react';

// import all the components we are going to use
import { SafeAreaView, Text, View, StyleSheet, Image } from 'react-native';
import { theme } from '../core/theme'

//import Card
import { Card as PaperCard } from 'react-native-paper';


export default function Card({ mode, style, ...props }:any) {
  return (
    <PaperCard>
      <Text style={styles.paragraph}>
        Animals
      </Text>
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    color: theme.colors.primary,
  },
});

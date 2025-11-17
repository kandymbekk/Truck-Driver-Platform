import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Crown } from 'lucide-react-native';

type PlusBadgeProps = {
  size?: 'small' | 'medium' | 'large';
};

export function PlusBadge({ size = 'medium' }: PlusBadgeProps) {
  const iconSize = size === 'small' ? 12 : size === 'medium' ? 16 : 20;
  const fontSize = size === 'small' ? 10 : size === 'medium' ? 12 : 14;

  return (
    <View style={[styles.badge, styles[size]]}>
      <Crown size={iconSize} color="#f59e0b" />
      <Text style={[styles.text, { fontSize }]}>PLUS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  large: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  text: {
    color: '#f59e0b',
    fontWeight: '700',
  },
});

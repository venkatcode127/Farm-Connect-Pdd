import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

const Sparkline = ({ data = [], height = 24, width = 64 }) => {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const isUp = data[data.length - 1] >= data[0];
  const barColor = isUp ? COLORS.accentGain : COLORS.accentRed;

  return (
    <View style={[styles.container, { width, height }]}>
      {data.map((val, idx) => {
        const normalized = ((val - min) / range);
        const barHeight = Math.max(4, normalized * height);
        return (
          <View
            key={idx}
            style={[
              styles.bar,
              {
                height: barHeight,
                backgroundColor: barColor,
                opacity: 0.4 + (idx / data.length) * 0.6,
              }
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  }
});

export default Sparkline;

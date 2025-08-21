import React, {useMemo, useRef} from 'react';
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import {ViewStyle} from 'react-native';

type AnimatedSwitcherProps = {
  index: number | string;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  durationMs?: number;
};

const AnimatedSwitcher: React.FC<AnimatedSwitcherProps> = ({
  index,
  children,
  style,
  durationMs = 250,
}) => {
  const prevIndexRef = useRef<number | string>(index);

  const isForward = useMemo(() => {
    let forward = true;
    const prev = prevIndexRef.current;
    if (typeof index === 'number' && typeof prev === 'number') {
      forward = index >= prev;
    }
    prevIndexRef.current = index;
    return forward;
  }, [index]);

  const entering = isForward
    ? SlideInRight.duration(durationMs)
    : SlideInLeft.duration(durationMs);
  const exiting = isForward
    ? SlideOutLeft.duration(durationMs)
    : SlideOutRight.duration(durationMs);

  return (
    <Animated.View
      key={`animated-switch-${String(index)}`}
      entering={entering}
      exiting={exiting}
      style={[{flex: 1}, style]}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedSwitcher;



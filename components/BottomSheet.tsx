import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

type BottomSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const BottomSheet: React.FC<BottomSheetProps> = ({ isVisible, onClose, children }) => {
  const translateY = useSharedValue(0);

  const scrollTo = (destination: number) => {
    'worklet';
    translateY.value = withSpring(destination, { damping: 50 });
  };

  useEffect(() => {
    if (isVisible) {
      scrollTo(MAX_TRANSLATE_Y);
    } else {
      scrollTo(0);
    }
  }, [isVisible]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startY: number }) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: { startY: number }) => {
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      if (translateY.value > -SCREEN_HEIGHT / 3) {
        scrollTo(0);
        runOnJS(setTimeout)(onClose, 300); // Add a delay before calling onClose
      } else {
        scrollTo(MAX_TRANSLATE_Y);
      }
    },
  });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolate.CLAMP
    );

    return {
      borderRadius,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        <View style={styles.line} />
        {React.isValidElement(children) ? React.cloneElement(children as React.ReactElement, { onClose }) : children}
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: '#1A1A1A',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
    zIndex: 2,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
});

export default BottomSheet;
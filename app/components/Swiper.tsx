import React, { memo, useState } from 'react'
import { Image, Pressable, StyleSheet, Text } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  withTiming,
} from 'react-native-reanimated'
import { Font } from '../common/globalStyle'
import Icon from '../constants/Icon'

const BUTTON_HEIGHT = 54

const SwipeButton = ({ onToggle }: { onToggle?: (toggle: boolean) => void }) => {
  const sharedValue = useSharedValue(0)
  const layoutWidth = useSharedValue(0)

  const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)
  const [toggled, setToggled] = useState(false)
  const handleComplete = (isToggled: boolean) => {
    if (isToggled !== toggled) {
      setToggled(isToggled)
      if (isToggled) {
        console.log(isToggled, '<<<<< isToggled')
      }
      onToggle && onToggle(isToggled)
    }
  }
  const animatedGestureHandler = useAnimatedGestureHandler({
    onActive: (e, ctx) => {
      if (!toggled) {
        const newValue = e.translationX
        if (newValue >= 0 && newValue <= layoutWidth.value) {
          sharedValue.value = newValue
        }
      }
    },
    onEnd: () => {
      if (sharedValue.value < layoutWidth.value / 2) {
        sharedValue.value = withTiming(0)
        runOnJS(handleComplete)(false)
      } else {
        sharedValue.value = withTiming(layoutWidth.value - 70)
        runOnJS(handleComplete)(true)
      }
    },
  })
  const animatedStylesSwipe = useAnimatedStyle(() => ({
    transform: [{ translateX: sharedValue.value }],
  }))
  const InterpolateXInput = [0, layoutWidth.value]

  const colorWave = useAnimatedStyle(() => ({
    width: 80 + sharedValue.value,
    // opacity: interpolate(sharedValue.value, InterpolateXInput, [0, 1]),
  }))

  const blackWidth = useAnimatedStyle(() => ({
    width: interpolate(sharedValue.value, InterpolateXInput, [layoutWidth.value - 40, 0]),
  }))

  return (
    <Animated.View
      style={[styles.containerStyle, layoutWidth.value ? { width: layoutWidth.value } : {}]}
      onLayout={(event) => {
        layoutWidth.value = event.nativeEvent.layout.width
      }}
    >
      <Animated.View
        style={[
          // layoutWidth.value ? { width: layoutWidth.value } : {},
          blackWidth,
          {
            height: BUTTON_HEIGHT,
            backgroundColor: 'rgba(34,34,34,1)',
            borderRadius: 10,
            position: 'absolute',
          },
        ]}
      ></Animated.View>
      <AnimatedLinearGradient
        colors={['#222222', '#8C46FF']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.background, colorWave]}
      />

      <PanGestureHandler onGestureEvent={animatedGestureHandler}>
        <Animated.View style={[styles.swipeableCircle, animatedStylesSwipe]}>
          <Image source={Icon.CHEVRON} />
        </Animated.View>
      </PanGestureHandler>

      <Text style={[styles.swipeText]}>달리기를 완료할게요</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    height: BUTTON_HEIGHT,
    borderRadius: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'relative',
  },
  swipeableCircle: {
    height: 54,
    width: 80,
    backgroundColor: '#8C46FF',
    borderRadius: 10,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    left: 0,
  },
  swipeText: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: Font.Pretendard,
    zIndex: 2,
    color: '#fff',
  },
  background: {
    height: BUTTON_HEIGHT,
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    // zIndex: 4,
    backgroundColor: 'red',
  },
})

export default memo(SwipeButton)

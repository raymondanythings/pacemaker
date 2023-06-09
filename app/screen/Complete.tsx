import React, { useEffect, useRef } from 'react'
import { View, Image, Animated } from 'react-native'
import Text from '../components/Text'
import { SafeAreaView } from 'react-native-safe-area-context'
import globalStyle from '../common/globalStyle'
import Confetti from '../components/Lotties/Confetti'
import { StackActions, useNavigation } from '@react-navigation/native'
import Icon from '../constants/Icon'
import bigEmotion, { Emotion } from '../constants/bigEmotion'
import useGetUser from '../hook/useGetUser'
import { useRecoilValue } from 'recoil'
import { useGetGrapeLazyQuery, useRunQuery } from '../../graphql/generated'
import { runAtom } from '../store/run'

const DELAY_NAVIGATION = 2200

const Complete = ({ route }: { route: { params: { emotion: Emotion } } }) => {
  const navigation = useNavigation()
  const { user } = useGetUser('network-only')
  const { emotion } = route.params || {}
  const runState = useRecoilValue(runAtom)
  const [getGrape] = useGetGrapeLazyQuery({
    fetchPolicy: 'network-only',
    onCompleted(data) {
      return setTimeout(() => {
        navigation.dispatch(StackActions.replace('grapes', { grape: data.grape }))
      }, DELAY_NAVIGATION)
    },
  })
  useRunQuery({
    variables: {
      id: runState.id,
    },
    onCompleted(data) {
      if (data?.run?.grapeId) {
        getGrape({
          variables: {
            id: data.run.grapeId,
          },
        })
      }
    },
  })
  const animation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.spring(animation, {
      toValue: 1,
      tension: 20,
      friction: 2,
      useNativeDriver: true,
    }).start()
  }, [])

  const bounceAnimation = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -150, 0],
  })

  return (
    <SafeAreaView style={[globalStyle.safeAreaContainer]}>
      <View style={[globalStyle.header]}>
        <Text style={[globalStyle.gaeguTitle, { textAlign: 'center' }]}>포도알을 획득했어요</Text>
        <Text style={[globalStyle.subheading, { textAlign: 'center' }]}>
          오늘 열심히 달렸으니, 내일 또 만나요~
        </Text>
      </View>
      <View style={[{ flex: 20, justifyContent: 'center', alignItems: 'center' }]}>
        <Confetti />
        <Animated.View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            transform: [{ translateY: bounceAnimation }],
          }}
        >
          <View style={{ width: '100%', aspectRatio: 1.3 }}>
            <Image
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
              }}
              source={Icon.GRAPEFORCONFETTI}
            />
            {emotion.value ? (
              <Image
                source={bigEmotion[emotion.value]}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                }}
              />
            ) : null}
          </View>
        </Animated.View>
      </View>
      <View style={[globalStyle.fullWidth, globalStyle.footer]}></View>
    </SafeAreaView>
  )
}

export default Complete

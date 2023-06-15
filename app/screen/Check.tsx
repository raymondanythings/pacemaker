import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback, useEffect } from 'react'
import Text from '../components/Text'
import { AUTH_HEADER } from '../constants/constants'
import { useSetRecoilState } from 'recoil'
import { authState } from '../store/auth'
import TrackPlayer from 'react-native-track-player'
import { useNavigation } from '@react-navigation/native'
const Check = () => {
  const setAuth = useSetRecoilState(authState)
  const navigation = useNavigation()
  const checkUser = useCallback(async () => {
    await TrackPlayer.setupPlayer()
    const initialCheck = await AsyncStorage.getItem('initialCheck')
    if (!initialCheck) {
      await AsyncStorage.setItem('initialCheck', 'initialCheck')
      return navigation.reset({
        index: 0,
        routes: [
          {
            name: 'mainScreen',
            params: {
              screen: 'letter',
            },
          },
        ],
      })
    }
    const token = await AsyncStorage.getItem(AUTH_HEADER)
    if (token) {
      setAuth(token)
    }
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'mainScreen',
          params: {
            screen: 'home',
          },
        },
      ],
    })
    // navigation.reset('mainScreen', { screen: 'home' })
  }, [])

  useEffect(() => {
    checkUser()
  }, [])
  return <Text>Loading..</Text>
}

export default Check

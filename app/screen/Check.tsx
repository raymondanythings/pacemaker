import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback, useEffect } from 'react'
import Text from '../components/Text'
import { AUTH_HEADER } from '../constants/constants'
import { useSetRecoilState } from 'recoil'
import { authState } from '../store/auth'
import TrackPlayer from 'react-native-track-player'
const Check = ({ navigation }: { navigation: any }) => {
  const setAuth = useSetRecoilState(authState)
  const checkUser = useCallback(async () => {
    const initialCheck = await AsyncStorage.getItem('initialCheck')
    if (!initialCheck) {
      await AsyncStorage.setItem('initialCheck', 'initialCheck')
      return navigation.navigate('mainScreen', { screen: 'letter' })
    }
    const token = await AsyncStorage.getItem(AUTH_HEADER)
    if (token) {
      setAuth(token)
    }
    navigation.navigate('mainScreen', { screen: 'grapes' })
  }, [])

  useEffect(() => {
    TrackPlayer.setupPlayer()
    checkUser()
  }, [])
  return <Text>Loading..</Text>
}

export default Check

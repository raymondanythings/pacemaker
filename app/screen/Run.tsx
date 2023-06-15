import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { View, StyleSheet, Pressable, Image } from 'react-native'
import { sendMessage } from 'react-native-watch-connectivity'
import MapView, {
  LatLng,
  Marker,
  MarkerAnimated,
  PROVIDER_GOOGLE,
  Polyline,
} from 'react-native-maps'
import { Platform } from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import { Font } from '../common/globalStyle'
import Text from '../components/Text'
import CUSTOM_MAP from '../constants/customMap'
import Icon from '../constants/Icon'
import colors from '../constants/colors'
import { generateColor } from '../../utils/linearGradient'
import { AuthorizationResult } from 'react-native-geolocation-service'
import useWatch from '../hook/useWatch'
import Heart from '../components/Lotties/Heart'
import PinkDots from '../components/Lotties/PinkDots'
import Swiper from '../components/Swiper'
import { StackActions, useNavigation } from '@react-navigation/native'
import { calculateDistance } from '../../utils/distance'
import FastImage from 'react-native-fast-image'
import Img from '../constants/Img'
import { useRecoilState, useRecoilValue } from 'recoil'
import { emotionState } from '../store/emotionState'
import { watchAtom } from '../store/watchAtom'
import { watchOsActionsType } from '../constants/constants'
import { RunType, useGetEncourageMutation } from '../../graphql/generated'
import { runAtom } from '../store/run'
import PurpleDots from '../components/Lotties/PurpleDots'
import PurplePin from '../components/Lotties/PurplePin'
import { screenWidth, screenHeight } from '../constants/screen'

// 위치 권한 요청
async function requestPermission() {
  try {
    if (Platform.OS === 'ios') {
      return await Geolocation.requestAuthorization('always')
    }
  } catch (e) {
    console.log(e)
  }
}
// 위도, 경도를 위한 인터페이스
export interface ILocation {
  latitude: number
  longitude: number
}

interface IGeolocation {
  latitude: number
  longitude: number
}

const GRADIENT_LIMIT = 40

const Run = () => {
  const watchState = useRecoilValue(watchAtom)
  const { isReachability } = useWatch()
  const [tracking, setTracking] = useState(true)
  const [locations, setLocations] = useState<Array<ILocation>>([])
  const [location, setLocation] = useState<IGeolocation>({
    latitude: 37.78825,
    longitude: -122.4324,
  })
  const changeCount = useRef<number>(0)
  const [runState, setRunState] = useRecoilState(runAtom)
  const [latestHeartRateOnPush, setLatestHeartRateOnPush] = useState(0)
  const selectedEmotion = useRecoilValue(emotionState)
  const [geolocationPermission, setGeolocationPermission] = useState<AuthorizationResult>()
  const [updateEncourage] = useGetEncourageMutation({
    onCompleted(data) {
      if (data.getEncourage) {
        console.log(data, '<< update done')
        setLatestHeartRateOnPush(watchState.heartRate)
      }
    },
    onError(error, clientOptions) {
      console.log(error, '<<error')
    },
  })

  const distance = useMemo(() => {
    const calcDistance = calculateDistance(locations)
    setRunState((prev) => ({
      ...prev,
      distance: calcDistance,
    }))
    return calcDistance
  }, [locations.length])
  const navigation = useNavigation()

  const geolocationRequest = useCallback(async () => {
    const result = await requestPermission()
    setGeolocationPermission(result)
  }, [])

  // 지도 관련 코드
  const mapViewRef = useRef<MapView>(null) // MapView 컴포넌트를 제어하기 위한 ref

  const watchId = useRef<number>()

  const clearWatch = () => {
    if (watchId.current) {
      Geolocation.clearWatch(watchId.current)
    }
  }

  const moveCamera = (latLng?: LatLng) => {
    if (mapViewRef.current) {
      mapViewRef.current.animateCamera(
        {
          center: {
            latitude: latLng?.latitude ?? location.latitude,
            longitude: latLng?.longitude ?? location.longitude,
          },
          heading: 0,
          ...(tracking ? { pitch: 0, zoom: 1 } : { zoom: 2, pitch: 10 }),
        },
        { duration: 1000 },
      )
    }
  }

  useEffect(() => {
    if (geolocationPermission === 'granted') {
      watchId.current = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation((prev) => ({ latitude, longitude }))
          if (tracking) {
            setLocations((prevLocations) => [...prevLocations, { latitude, longitude }])
          }
          moveCamera({ latitude, longitude })
          // console.log(runState, 'dfsjfdlk')
        },
        (error) => {
          console.log(error)
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          accuracy: {
            ios: 'bestForNavigation',
          },
        },
      )
    }

    return () => {
      clearWatch()
    }
  }, [tracking, geolocationPermission])

  useLayoutEffect(() => {
    geolocationRequest()
  }, [])

  useEffect(() => {
    let id: NodeJS.Timer
    if (tracking) {
      if (runState.type === RunType.HeartRate) {
        id = setInterval(() => {
          changeCount.current++
        }, 1000)
      } else {
        id = setInterval(() => {
          postEncourage()
        }, 25000)
      }
    }
    navigation.addListener('blur', () => {
      clearWatch()
      clearInterval(id)
    })
    return () => {
      clearWatch()
      clearInterval(id)
    }
  }, [tracking])

  const postEncourage = () => {
    updateEncourage({
      variables: {
        input: {
          runId: runState.id,
          currentHeartRate: watchState.heartRate ? watchState.heartRate : undefined,
        },
      },
    })
  }

  // useEffect(() => {
  //   let id: NodeJS.Timer
  //   if (tracking) {
  //     if (runState.type === RunType.HeartRate) {
  //       id = setInterval(() => {
  //         changeCount.current++
  //         // if (changeCount.current >= 60) {
  //         //   clearInterval(id)
  //         // }
  //       }, 1000)
  //     }
  //     navigation.addListener('blur', () => {
  //       clearInterval(id)
  //     })
  //   }
  //   return () => {
  //     clearInterval(id)
  //   }
  // }, [isReachability, tracking])

  useEffect(() => {
    if (tracking && isReachability) {
      if (changeCount.current >= 25) {
        postEncourage()
        changeCount.current = 0
      }
    } else {
      changeCount.current = 0
    }
  }, [changeCount.current, tracking, isReachability])

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapViewRef}
        style={{
          flex: 1,
          position: 'relative',
        }}
        provider={PROVIDER_GOOGLE}
        customMapStyle={CUSTOM_MAP}
        initialRegion={
          locations.length > 0
            ? {
                latitude: locations[0].latitude, // 맨 처음 위치
                longitude: locations[0].longitude, // 맨 처음 위치
                latitudeDelta: 0.0005,
                longitudeDelta: 0.0021,
              }
            : undefined
        }
        // showsUserLocation
        followsUserLocation
        userLocationCalloutEnabled
        loadingEnabled
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        minZoomLevel={18}
      >
        <MarkerAnimated
          // ref={userMarker}
          coordinate={{
            latitude: location.latitude - 0.00007,
            longitude: location.longitude + 0.0000001,
          }}
        >
          <View style={{ position: 'relative', top: 40 }}>
            {tracking ? (
              <FastImage
                source={Img.LOGO_MOVING}
                style={styles.marker}
                resizeMode={FastImage.resizeMode.contain}
              />
            ) : (
              <Image source={Img.PAUSETURTLE} style={styles.marker} />
            )}
          </View>
        </MarkerAnimated>
        {locations[0]?.latitude ? (
          <MarkerAnimated
            coordinate={{
              latitude: locations[0].latitude - 0.0003,
              longitude: locations[0].longitude + 0.0000001,
            }}
            style={{ zIndex: -1 }}
          >
            <View style={{ padding: 20 }}>
              <View
                style={{
                  borderRadius: 9999,
                  backgroundColor: selectedEmotion.color,
                  borderWidth: 8,
                  borderColor: '#fff',
                  width: 45,
                  height: 45,
                  shadowColor: selectedEmotion.color,
                  shadowOpacity: 0.9,
                  shadowRadius: 10,
                  shadowOffset: {
                    height: 0,
                    width: 0,
                  },
                }}
              ></View>
              <Text style={{ textAlign: 'center', fontFamily: Font.RF, fontSize: 22 }}>START</Text>
            </View>
          </MarkerAnimated>
        ) : null}
        {/* 테두리 선 */}
        <Polyline
          coordinates={locations}
          strokeColors={
            locations.length >= 2
              ? locations.length <= GRADIENT_LIMIT
                ? [...generateColor('#5424FE', selectedEmotion.borderColor, locations.length)]
                : [
                    ...generateColor('#5424FE', selectedEmotion.borderColor, GRADIENT_LIMIT),
                    ...Array.from({ length: locations.length - GRADIENT_LIMIT }).map(
                      (_) => '#5424FE',
                    ),
                  ]
              : []
          }
          strokeWidth={24}
        />
        <Polyline
          coordinates={locations}
          strokeColors={
            locations.length >= 2
              ? locations.length <= GRADIENT_LIMIT
                ? [...generateColor('#8C46FF', selectedEmotion.color, locations.length)]
                : [
                    ...generateColor('#8C46FF', selectedEmotion.color, GRADIENT_LIMIT),
                    ...Array.from({ length: locations.length - GRADIENT_LIMIT }).map(
                      (_) => '#8C46FF',
                    ),
                  ]
              : []
          }
          strokeWidth={20}
          style={{
            borderColor: 'red',
          }}
          lineJoin='round'
        />
      </MapView>
      {/* bpm 컨테이너 */}
      <View
        style={{
          position: 'absolute',
          top: 60,
          height: 120,
          borderRadius: 20,
          backgroundColor: '#fff',
          width: screenWidth - 60,
          marginHorizontal: 30,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          ...Platform.select({
            ios: {
              shadowColor: 'rgba(0, 0, 0, 0.08)',
              shadowOpacity: 4,
              shadowRadius: 20,
              shadowOffset: {
                height: 10,
                width: 0,
              },
            },
          }),
        }}
      >
        {tracking ? (
          runState.type === RunType.Distance ? (
            <PurplePin />
          ) : (
            <Heart />
          )
        ) : runState.type === RunType.Distance ? (
          <PurpleDots />
        ) : (
          <PinkDots />
        )}
        {tracking ? (
          runState.type === RunType.Distance ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'baseline',
              }}
            >
              <Text
                style={{
                  color: 'black',
                  fontSize: 46,
                  fontFamily: Font.Pretendard_Semibold,
                }}
              >
                {distance > 1 ? distance.toFixed(2) : (distance * 1000).toFixed()}
              </Text>
              <Text style={{ fontFamily: Font.Pretendard, color: 'black', fontSize: 20 }}>
                {distance > 1 ? ' KM' : ' m'}
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontFamily: Font.Pretendard, fontSize: 46, fontWeight: '700' }}>
                  {Math.round(watchState.heartRate || 0)}
                </Text>
                <Text style={{ fontSize: 30, fontFamily: Font.Pretendard }}> BPM</Text>
              </View>
              <Text
                style={{
                  fontFamily: Font.Pretendard,
                  color: '#A0A0A0',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
              >
                {distance > 1 ? distance.toFixed(2) + ' KM' : (distance * 1000).toFixed() + ' m'}
              </Text>
            </View>
          )
        ) : (
          <View style={{ flex: 1, right: 40 }}>
            <Text
              style={{
                fontFamily: Font.Pretendard,
                fontSize: 30,
                fontWeight: '600',
                lineHeight: 50,
              }}
            >
              휴식 중
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          backgroundColor: 'white',
          height: 160,
          justifyContent: 'flex-end',
          bottom: 0,
          paddingBottom: 40,
          paddingHorizontal: 40,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#333333',
          shadowRadius: 3,
          shadowOpacity: 30,
          shadowOffset: {
            height: 4,
            width: 0,
          },
        }}
      >
        <Pressable
          onPress={() => {
            setTracking((prev) => {
              if (!prev) {
                clearWatch()
              }
              return !prev
            })
            sendMessage(
              { action: 'pause' as watchOsActionsType },
              // (payload) => {
              //   console.log(payload, '<<<')
              // },
            )
          }}
          style={{
            backgroundColor: colors.PURPLE,
            width: 90,
            height: 90,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 9999,
            alignSelf: 'center',
            // position: 'absolute',
            top: -20,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Image source={tracking ? Icon.PAUSE : Icon.START} style={{ width: 21, height: 25 }} />
        </Pressable>
        <Swiper
          onToggle={() => {
            setTimeout(() => {
              sendMessage({ action: 'resume' as watchOsActionsType })

              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'afteremotion',
                  },
                ],
              })
            }, 1500)
          }}
        />
      </View>
    </View>
    // </SafeAreaView>
  )
}

export default Run

const styles = StyleSheet.create({
  radius: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  marker: {
    height: 70,
    width: 100,
    resizeMode: 'contain',
  },
})

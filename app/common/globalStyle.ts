import { StyleSheet } from 'react-native'
import { hasNotch } from 'react-native-device-info'

export const Font = {
  Pretendard: 'Pretendard-Regular',
  RF: 'RF',
  GAEGU_M: 'JGaegujaengyi-Medium',
  GAEGU_L: 'JGaegujaengyi-Light',
  GAEGU_B: 'JGaegujaengyi-Bold',
}
export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 44,
    lineHeight: 55,
    letterSpacing: 3,
    fontFamily: Font.GAEGU_B,
    marginBottom: 4,
  },
  gaeguTitle: {
    fontSize: 28,
    lineHeight: 55,
    fontWeight: 'bold',
  },
  gaeguSub: {
    fontSize: 16,
  },
  gaeguEmotion: {
    fontSize: 16,
  },

  subheading: {
    fontSize: 14,
    fontWeight: '400',
    color: '#A1AEB7',
    fontFamily: Font.Pretendard,
    lineHeight: 24,
  },
  safeAreaContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontFamily: Font.GAEGU_M,
  },
  fullWidth: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    position: 'relative',
    flex: 5,
    marginTop: 40,
    alignItems: 'center',
  },
  center: {
    flex: 13,
  },
  footer: {
    flex: hasNotch() ? 3.5 : 4,
    rowGap: 8,
  },
  fontMedium: {
    fontSize: 14,
    fontWeight: '500',
  },
  Pretendard: {
    fontFamily: Font.Pretendard,
  },
  grapeColorFont: {
    color: '#8C46FF',
  },
})

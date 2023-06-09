import React, { FunctionComponent } from 'react'
import { Image, View } from 'react-native'
import Icon from '../constants/Icon'
import Text from './Text'
import { Font } from '../common/globalStyle'
import colors from '../constants/colors'

interface GrapeCountProps {
  count: number
}
const TOTAL_COUNT = 6
const GrapeCount: FunctionComponent<GrapeCountProps> = ({ count }) => {
  const c = count % TOTAL_COUNT
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 4,
        columnGap: 10,
        position: 'relative',
        alignItems: 'center',
      }}
    >
      {Array.from({ length: c }).map((_, index) => (
        <Image key={'fill' + index} source={Icon.GRAPECIRCLE} />
      ))}
      {Array.from({ length: TOTAL_COUNT - c }, (v, i) => i + c + 1).map((c) => (
        <View
          key={c}
          style={{
            width: 30,
            height: 30,
            backgroundColor: 'rgba(160, 160, 160,0.15)',
            borderRadius: 9999,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 18, lineHeight: 24, color: colors.TEXT_MAIN_1 }}>{c}</Text>
        </View>
      ))}

      <Text
        style={{
          position: 'absolute',
          right: '-13%',
          fontFamily: Font.RF,
          fontSize: 18,
          lineHeight: 24,
          color: colors.TEXT_MAIN_1,
          letterSpacing: -2,
        }}
      >
        {c % 6} / 6
      </Text>
    </View>
  )
}

export default GrapeCount

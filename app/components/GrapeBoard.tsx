import React, { useMemo, Fragment, useRef, useState } from 'react'
import { Image, ImageStyle, LayoutRectangle, View } from 'react-native'
import Img from '../constants/Img'
import Icon from '../constants/Icon'
import { RunFragment } from '../../graphql/generated'
import bigEmotion from '../constants/bigEmotion'
import { hasNotch } from 'react-native-device-info'
const GrapeBoard = ({ runs }: { runs: RunFragment[] }) => {
  const [grapeLayout, setGrapeLayout] = useState<LayoutRectangle | null>(null)
  const isNotch = hasNotch()
  const imageStyles = useMemo(() => {
    console.log(grapeLayout, '<<grapeLayout.current')
    return [
      {
        position: 'absolute',
        width: '33%',
        height: '33%',
        top: grapeLayout?.height ? grapeLayout?.height * 0.18 : '18%',
        left: grapeLayout?.width ? grapeLayout?.width * 0.02 : '1%',
        resizeMode: 'contain',
      } as ImageStyle,
      {
        position: 'absolute',
        width: '33%',
        height: '33%',
        top: grapeLayout?.height ? grapeLayout?.height * 0.22 : '20.5%',
        left: grapeLayout?.width ? grapeLayout?.width * 0.34 : '32%',
        resizeMode: 'contain',
      } as ImageStyle,
      {
        position: 'absolute',
        width: '33%',
        height: '33%',
        top: grapeLayout?.height ? grapeLayout?.height * 0.26 : '24%',
        left: grapeLayout?.width ? grapeLayout?.width * 0.65 : '63%',
        resizeMode: 'contain',
      } as ImageStyle,
      {
        position: 'absolute',
        width: '33%',
        height: '33%',
        top: grapeLayout?.height ? grapeLayout?.height * 0.44 : '38%',
        left: grapeLayout?.width ? grapeLayout?.width * 0.12 : '11%',
        resizeMode: 'contain',
      } as ImageStyle,
      {
        position: 'absolute',
        width: '33%',
        height: '33%',
        top: grapeLayout?.height ? grapeLayout?.height * 0.48 : '42%',
        left: grapeLayout?.width ? grapeLayout?.width * 0.45 : '44%',
        resizeMode: 'contain',
      } as ImageStyle,
      {
        position: 'absolute',
        width: '33%',
        height: '33%',
        top: grapeLayout?.height ? grapeLayout?.height * 0.68 : '69%',
        left: grapeLayout?.width ? grapeLayout?.width * 0.25 : '23%',

        resizeMode: 'contain',
      } as ImageStyle,
    ]
  }, [isNotch, grapeLayout])

  return (
    <View>
      <Image
        source={Img.GRAPE}
        onLayout={(event) => {
          setGrapeLayout(() => event.nativeEvent.layout)
        }}
      />
      {runs.map((run, i) => (
        <Fragment key={i}>
          <Image style={imageStyles[i % imageStyles.length]} source={Icon.GRAPEFORCONFETTI} />
          {run.emotionAfter ? (
            <Image
              style={imageStyles[i % imageStyles.length]}
              source={bigEmotion[run.emotionAfter]}
            />
          ) : null}
        </Fragment>
      ))}
    </View>
  )
}

export default GrapeBoard

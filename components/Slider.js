
import React, { Component } from 'react'
import { Animated, View, StyleSheet, Image, Dimensions, ScrollView } from 'react-native'

const deviceWidth = Dimensions.get('window').width - 40
const FIXED_BAR_WIDTH = 130
const BAR_SPACE = 3

const images = [
  'https://i.imgur.com/5GnlNav.jpg',
  'https://i.imgur.com/Mg4XXjL.jpg',
  'https://i.imgur.com/2ITsXz6.jpg',
]

export default class App extends Component {

  numItems = images.length
  itemWidth = (FIXED_BAR_WIDTH / this.numItems) - ((this.numItems - 1) * BAR_SPACE)
  animVal = new Animated.Value(0)

  render() {
    let imageArray = []
    let barArray = []
    images.forEach((image, i) => {
      const thisImage = (
        <Image
          key={`image${i}`}
          source={{ uri: image }}
          style={{ width: deviceWidth }}
        />
      )
      imageArray.push(thisImage)

      const scrollBarVal = this.animVal.interpolate({
        inputRange: [deviceWidth * (i - 1), deviceWidth * (i + 1)],
        outputRange: [-this.itemWidth, this.itemWidth],
        extrapolate: 'clamp',
      })

      const thisBar = (
        <View style={styles.Button}>
          <View
            key={`bar${i}`}
            style={[
              styles.track,
              {
                width: this.itemWidth,
                marginLeft: i === 0 ? 0 : BAR_SPACE,
              },
            ]}
          >
            <Animated.View

              style={[
                styles.bar,
                {
                  width: this.itemWidth,
                  transform: [
                    { translateX: scrollBarVal },
                  ],
                },
              ]}
            />
          </View>
        </View>
      )
      barArray.push(thisBar)
    })

    return (
      <View
        style={styles.SliderContainer}
        flex={1}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={10}
          pagingEnabled
          onScroll={
            Animated.event(
              [{ nativeEvent: { contentOffset: { x: this.animVal } } }]
            )
          }
        >

          {imageArray}

        </ScrollView>
        <View
          style={styles.barContainer}
        >
          {barArray}
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  barContainer: {
    position: 'absolute',
    zIndex: 2,
    top: 200,
    flexDirection: 'row',
  },
  track: {
    backgroundColor: '#ccc',
    overflow: 'hidden',
    height: 2,
  },
  bar: {
    backgroundColor: '#18e794',
    height: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  SliderContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 5,
    height: 100,
    marginLeft: 20,
    marginRight: 20,
  },
})
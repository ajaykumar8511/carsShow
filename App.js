// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { 
  StatusBar,
  Image,
  FlatList,
  Dimensions,
  Animated,
  Text,
  View,
  StyleSheet,
  SafeAreaView, 
} from 'react-native';

import {
  FlingGestureHandler,
  Directions,
  State,
} from 'react-native-gesture-handler';


const { width } = Dimensions.get('screen');


const DATA = [
  {
    model: 'F8',
    price: '$276,550',
    brand: 'Ferrari',
    poster:
      'https://www.eagevents.com/wp-content/uploads/2020/07/f8-vertical.jpg',
  },
  {
    model: 'Ghost',
    price: '$311,900',
    brand: 'Rolls Royce',
    poster:
      'https://iphonewallpaperworld.com/wp-content/uploads/2020/07/Rolls-Royce-iPhone-Wallpapers-15-473x1024.jpg',
  },
  {
    model: 'Chiron',
    price: '$3,000,000',
    brand: 'Bugatti',
    poster:
      'https://wallpapercave.com/wp/wp4874370.jpg',
  },
  {
    model: 'P1 GTR',
    price: '$1,350,000',
    brand: 'Mclaren',
    poster:
      'https://wallpaperaccess.com/full/1541330.jpg',
  },
  {
    model: 'Aventador SVJ Roadster',
    price: '$573,966',
    brand: 'Lamborghini',
    poster:
      'https://www.mordeo.org/files/uploads/2019/03/Lamborghini-Aventador-SVJ-Roadster-4K-Ultra-HD-Mobile-Wallpaper-950x1689.jpg',
  },
  {
    model: 'BMW I4',
    price: '$56,395',
    brand: 'BMW',
    poster:
      'https://i.pinimg.com/originals/da/f4/b9/daf4b9a8cc853862a9997237aac3e32e.png',
  },
  {
    model: 'Mustang GT',
    price: '$35,630',
    brand: 'Ford',
    poster:
      'https://i.pinimg.com/originals/b9/d3/81/b9d381d8caa5c8bafb09d57528734f1e.jpg',
  },
  {
    model: 'AMG GT Coupe',
    price: '$153,500',
    brand: 'Mercedes',
    poster:
      'https://i.pinimg.com/originals/f6/21/2b/f6212b5181c56654d3f6efdee1c7dc9b.png',
  },
  {
    model: 'LC 500h',
    price: '$97,510',
    brand: 'Lexus',
    poster:
      'https://i.pinimg.com/originals/49/90/08/499008aac426a3913cfcd67914ed63d5.jpg',
  },
];

const OVERFLOW_HEIGHT = 85;
const SPACING = 2;
const ITEM_WIDTH = width * 0.78;
const ITEM_HEIGHT = ITEM_WIDTH * 1.8;
const VISIBLE_ITEMS = 3;

const OverflowItems = ({ data, scrollXAnimated }) => {
  const inputRange = [-1, 0, 1];
  const translateY = scrollXAnimated.interpolate({
    inputRange,
    outputRange: [OVERFLOW_HEIGHT, 0, -OVERFLOW_HEIGHT],
  });
  return (
    <View style={styles.overflowContainer}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {data.map((item, index) => {
          return (
            <View key={index} style={styles.itemContainer}>
              <Text style={[styles.model]} numberOfLines={1}>
                {item.model}
              </Text>
              <View style={styles.itemContainerRow}>
                <Text style={[styles.price]}>
                  Starting from&nbsp; {item.price}
                </Text>
                <Text style={[styles.brand]}>{item.brand}</Text>
              </View>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
};


export default function App() {
  
  const [data, setData] = React.useState(DATA);
  const scrollXIndex = React.useRef(new Animated.Value(0)).current;
  const scrollXAnimated = React.useRef(new Animated.Value(0)).current;
  const [index, setIndex] = React.useState(0);
  const setActiveIndex = React.useCallback((activeIndex) => {
    scrollXIndex.setValue(activeIndex);
    setIndex(activeIndex);
  });

  React.useEffect(() => {
    if (index === data.length - VISIBLE_ITEMS - 1) {
      // get new data
      // fetch more data
      const newData = [...data, ...data];
      setData(newData);
    }
  });

  React.useEffect(() => {
    Animated.spring(scrollXAnimated, {
      toValue: scrollXIndex,
      useNativeDriver: true,
    }).start();
  });

  return (
    <FlingGestureHandler
      key='left'
      direction={Directions.LEFT}
      onHandlerStateChange={(ev) => {
        if (ev.nativeEvent.state === State.END) {
          if (index === data.length - 1) {
            return;
          }
          setActiveIndex(index + 1);
        }
      }}
    >
      <FlingGestureHandler
        key='right'
        direction={Directions.RIGHT}
        onHandlerStateChange={(ev) => {
          if (ev.nativeEvent.state === State.END) {
            if (index === 0) {
              return;
            }
            setActiveIndex(index - 1);
          }
        }}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar hidden />
          <OverflowItems data={data} scrollXAnimated={scrollXAnimated} />
          <FlatList
            data={data}
            keyExtractor={(_, index) => String(index)}
            horizontal
            inverted
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
              padding: SPACING * 2,
              marginTop: 50,
            }}
            scrollEnabled={false}
            removeClippedSubviews={false}
            CellRendererComponent={({
              item,
              index,
              children,
              style,
              ...props
            }) => {
              const newStyle = [style, { zIndex: data.length - index }];
              return (
                <View style={newStyle} index={index} {...props}>
                  {children}
                </View>
              );
            }}
            renderItem={({ item, index }) => {
              const inputRange = [index - 1, index, index + 1];
              const translateX = scrollXAnimated.interpolate({
                inputRange,
                outputRange: [50, 0, -100],
              });
              const scale = scrollXAnimated.interpolate({
                inputRange,
                outputRange: [0.8, 1, 1.3],
              });
              const opacity = scrollXAnimated.interpolate({
                inputRange,
                outputRange: [1 - 1 / VISIBLE_ITEMS, 1, 0],
              });

              return (
                <Animated.View
                  style={{
                    position: 'absolute',
                    left: -ITEM_WIDTH / 2,
                    opacity,
                    transform: [
                      {
                        translateX,
                      },
                      { scale },
                    ],
                  }}
                >
                  <Image
                    source={{ uri: item.poster }}
                    style={{
                      width: ITEM_WIDTH,
                      height: ITEM_HEIGHT,
                      borderRadius: 10,
                    }}
                  />
                </Animated.View>
              );
            }}
          />
        </SafeAreaView>
      </FlingGestureHandler>
    </FlingGestureHandler>
  );
  
  
  // return (
  //   <View style={styles.container}>
  //     <Text>Nexus!</Text>
  //     <StatusBar style="auto" />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F8F8FF',
    
  },
  model: {
    fontSize: 27,
    fontWeight:'bold',
    fontFamily: 'Inter_900Black',
    color: '#242124',
    letterSpacing: -1,
  },
  price: {
    fontSize: 16,
    color: '#555555',
  },
  brand: {
    fontWeight:'bold',
    fontSize: 18,
    color: '#1a1110',
  },
  itemContainer: {
    height: OVERFLOW_HEIGHT,
    padding: SPACING * 2,
    padding:21,
    
  },
  itemContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:3,
    
  },
  overflowContainer: {
    height: OVERFLOW_HEIGHT,
    overflow: 'hidden',
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

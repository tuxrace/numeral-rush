/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableHighlight,
  Animated,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const RANGE = 100;
const PAIRS = 12;
const CARD_SIZE = 80;

const App: () => React$Node = () => {
  const [cards, setCards] = useState([]);
  const [steps, setSteps] = useState(0);
  const [ openedCards, setOpenedCards ] = useState([]);
  const [clicked, setClicked] = useState(null);

  const deg = useRef(new Animated.Value(0)).current;
  let degVal = useRef(0).current;

  deg.addListener(({value}) => {
    degVal = value;
  });

  const downVal = deg.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const upVal = deg.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const down = {
    transform: [{rotateY: downVal}],
  };

  const up = {
    transform: [{rotateY: upVal}],
  };

  const flip = (flipState = 'closed') => {
    // console.log(degVal);
    // if (Math.ceil(degVal) > 0) {
    //   Animated.timing(deg, {
    //     toValue: 0,
    //     duration: 180,
    //     useNativeDriver: true,
    //   }).start();
    // } else {
    //   Animated.timing(deg, {
    //     toValue: 1,
    //     duration: 180,
    //     useNativeDriver: true,
    //   }).start();
    // }
    if (flipState === 'open') {
      Animated.timing(deg, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(deg, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
  };

  const initialize = () => {
    const numerals = Array.from(Array(RANGE), (_, i) => i + 1);
    const set = shuffle(numerals).slice(0, PAIRS);
    const shuf = shuffle([...set, ...set]);
    const data = shuf.map((i, idx) => {
      return {
        val: i,
        state: null,
        idx,
      };
    });
    setCards(data);
    setSteps(0);
  };

  const restart = () => {
    initialize();
  };

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const click = (idx) => {
    let newCards = [...cards];
    if (newCards[idx].state === 'disabled') {
      return;
    }
    setClicked(idx);
    setSteps(steps + 1);

    if (newCards[idx].state === 'open') {
      flip('open');
      newCards[idx].state = 'closed';
    } else {
      flip('closed');
      newCards[idx].state = 'open';
    }

    const opened = newCards.filter((i) => i.state === 'open');
    setOpenedCards(opened);
    console.log(opened)
    if (opened.length === 2) {
      if (opened[0].val === opened[1].val) {
        newCards[opened[0].idx].state = 'disabled';
        newCards[opened[1].idx].state = 'disabled';
      }
      setCards(newCards);
      return;
    }

    if (opened.length === 3) {
      newCards = cards.map(i => {
        if (i.idx !== newCards[idx].idx && i.state !== 'disabled') {
          return {
            ...i,
            state: 'closed',
          };
        }
        return i;
      });
      flip('open');
      setCards(newCards);
      return;
    }

    setCards(newCards);
  };

  useEffect(() => {
    initialize();
  },[]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <Text style={styles.text}>{steps}</Text>
          </View>
          <View style={styles.body}>
            {cards.map((item, x) => (
              <View>
                {/* <TouchableHighlight onPress={() => click(x)} key={x}>
                  <View style={item.state === 'disabled' ? styles.disabled : styles.card}>
                    <Text style={styles.text}> {item.state === 'open' || item.state === 'disabled' ? item.val : ''}</Text>
                  </View>
                </TouchableHighlight> */}
                <TouchableHighlight onPress={() => click(x)} key={x}>
                  <>
                    <Animated.View style={[styles.cardUp, item.state !== null ? up : {}]}>
                      <Text style={styles.text}> {item.val} </Text>
                    </Animated.View>
                    <Animated.View style={[styles.cardDown, item.state !== null ? down : {}]}>
                    </Animated.View>
                  </>
                </TouchableHighlight>
              </View>
            ))}
          </View>
          <View style={styles.body}>
            <TouchableHighlight onPress={restart}>
              <Text style={styles.text}> Restart Game </Text>
            </TouchableHighlight>
          </View>
          {/* <TouchableHighlight onPress={flip}>
            <>
              <Animated.View style={[styles.cardUp, up]}>
                <Text> x </Text>
              </Animated.View>
              <Animated.View style={[styles.cardDown, down]}>
              </Animated.View>
            </>
          </TouchableHighlight> */}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: 'grey',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    backfaceVisibility: 'hidden',
  },
  cardUp: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: 'lightgrey',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    margin: 4,
  },
  cardDown: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: 'grey',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    margin: 4,
  },
  disabled: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: 'yellow',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default App;

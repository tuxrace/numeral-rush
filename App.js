/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableHighlight,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const App: () => React$Node = () => {
  const [cards, setCards] = useState([]);

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

    if (newCards[idx].state === 'open') {
      newCards[idx].state = 'closed';
    } else {
      newCards[idx].state = 'open';
    }
    const opened = newCards.filter(i => i.state === 'open');
    console.log(opened);

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
      setCards(newCards);
      return;
    }

    setCards(newCards);
  };

  useEffect(() => {
    const set = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const shuf = shuffle([...set, ...set]);
    const data = shuf.map((i, idx) => {
      return {
        val: i,
        state: 'closed',
        idx,
      };
    });
    setCards(data);
  },[]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            {cards.map((item, x) => (
              <TouchableHighlight onPress={() => click(x)}>
                <View style={item.state === 'disabled' ? styles.disabled : styles.card}>
                  <Text style={styles.text}> {item.state === 'open' || item.state === 'disabled' ? item.val : ''} </Text>
                </View>
              </TouchableHighlight>
              ))}
          </View>
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
    width: 80,
    height: 80,
    backgroundColor: 'grey',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  disabled: {
    width: 80,
    height: 80,
    backgroundColor: 'yellow',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;

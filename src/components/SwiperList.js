import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';

const DATA = [
  {id: '1', text: 'Item 1'},
  {id: '2', text: 'Item 2'},
  {id: '3', text: 'Item 3'},
  {id: '4', text: 'Item 4'},
  {id: '5', text: 'Item 5'},
];

const Item = ({item, onSwipeFromLeft, onSwipeFromRight}) => {
  const renderRightActions = (progress, dragX) => {
    const likeOpacity = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={[styles.action, styles.likeAction]}
        onPress={onSwipeFromRight}>
        <Text style={[styles.actionText, styles.likeActionText]}>Like</Text>
        <Animated.View style={{opacity: likeOpacity}}>
          <Text style={[styles.actionText, styles.likeActionText]}>❤️</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderLeftActions = (progress, dragX) => {
    const deleteOpacity = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={[styles.action, styles.deleteAction]}
        onPress={onSwipeFromLeft}>
        <Animated.View style={{opacity: deleteOpacity}}>
          <Text style={[styles.actionText, styles.deleteActionText]}>🗑️</Text>
        </Animated.View>
        <Text style={[styles.actionText, styles.deleteActionText]}>Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}>
        <View style={styles.item}>
          <Text>{item.text}</Text>
        </View>
      </Swipeable>
    </SafeAreaView>
  );
};

const App = () => {
  const [data, setData] = useState(DATA);

  const handleSwipeFromLeft = id => {
    setData(prevData => prevData.filter(item => item.id !== id));
  };

  const handleSwipeFromRight = id => {
    setData(prevData =>
      prevData.map(item => {
        if (item.id === id) {
          return {...item, liked: true};
        }
        return item;
      }),
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <Item
            item={item}
            onSwipeFromLeft={() => handleSwipeFromLeft(item.id)}
            onSwipeFromRight={() => handleSwipeFromRight(item.id)}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  action: {
    alignItems: 'center',
  },
});

export default App;

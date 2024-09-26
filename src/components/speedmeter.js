import React, { Component } from 'react';
import { View, Image, Animated, Easing, Text } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

import calculateDegreeFromLabels from '../utils/calculate-degree-from-labels';
import calculateLabelFromValue from '../utils/calculate-label-from-value';
import limitValue from '../utils/limit-value';
import validateSize from '../utils/validate-size';
import style, { width as deviceWidth } from '../styles/index';

class Speedmeter extends Component {
  static propTypes = {
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    size: PropTypes.any,
    minValue: PropTypes.any,
    maxValue: PropTypes.any,
    easeDuration: PropTypes.any,
    allowedDecimals: PropTypes.any,
    labels: PropTypes.array,
    needleImage: PropTypes.any,
    wrapperStyle: PropTypes.any,
    outerCircleStyle: PropTypes.any,
    halfCircleStyle: PropTypes.any,
    imageWrapperStyle: PropTypes.any,
    imageStyle: PropTypes.any,
    innerCircleStyle: PropTypes.any,
    labelWrapperStyle: PropTypes.any,
    labelStyle: PropTypes.any,
    labelNoteStyle: PropTypes.any,
    useNativeDriver: PropTypes.any,
  };

  static defaultProps = {
    value: null,
    defaultValue: 0,
    size: null,
    minValue: 0,
    maxValue: 100,
    easeDuration: 300,
    allowedDecimals: 0,
    labels: [],
    needleImage: null,
    wrapperStyle: null,
    outerCircleStyle: null,
    halfCircleStyle: null,
    imageWrapperStyle: null,
    imageStyle: null,
    innerCircleStyle: null,
    labelWrapperStyle: null,
    labelStyle: null,
    labelNoteStyle: null,
    useNativeDriver: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      speedometerValue: new Animated.Value(this.props.defaultValue),
    };
  }

  componentDidMount() {
    this.animateSpeedometerValue();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.animateSpeedometerValue();
    }
  }

  animateSpeedometerValue = () => {
    const {
      minValue,
      maxValue,
      allowedDecimals,
      easeDuration,
      useNativeDriver,
    } = this.props;
    const { speedometerValue } = this.state;

    Animated.timing(speedometerValue, {
      toValue: limitValue(this.props.value, minValue, maxValue, allowedDecimals),
      duration: easeDuration,
      easing: Easing.linear,
      useNativeDriver,
    }).start();
  };

  render() {
    const {
      value,
      size,
      minValue,
      maxValue,
      labels,
      needleImage,
      wrapperStyle,
      outerCircleStyle,
      halfCircleStyle,
      imageWrapperStyle,
      imageStyle,
      innerCircleStyle,
      labelWrapperStyle,
      labelStyle,
      useNativeDriver,
    } = this.props;

    const degree = 180;
    const perLevelDegree = calculateDegreeFromLabels(degree, labels);
    const label = calculateLabelFromValue(
      limitValue(value, minValue, maxValue, this.props.allowedDecimals),
      labels,
      minValue,
      maxValue
    );

    const { speedometerValue } = this.state;

    const rotate = speedometerValue.interpolate({
      inputRange: [minValue, maxValue],
      outputRange: ['-90deg', '90deg'],
    });

    const currentSize = validateSize(size, deviceWidth - 20);

    return (
      <View
        style={[
          style.wrapper,
          {
            width: currentSize,
            height: currentSize / 2,
          },
          wrapperStyle,
        ]}
      >
        <LinearGradient
          colors={['rgb(100,141,173)', 'rgb(53,83,159)']}
          style={[
            style.outerCircle,
            {
              width: currentSize,
              height: currentSize / 2,
              borderTopLeftRadius: currentSize / 2,
              borderTopRightRadius: currentSize / 2,
              backgroundColor: '#000',
            },
            outerCircleStyle,
          ]}
        >
          {labels &&
            labels.map((level, index) => {
              const circleDegree = 90 + index * perLevelDegree;
              return (
                <View
                  key={level.name}
                  style={[
                    style.halfCircle,
                    {
                      width: currentSize / 2,
                      height: 10,
                      borderRadius: currentSize / 2,
                      transform: [
                        { translateX: currentSize / 4 },
                        { rotate: `${circleDegree}deg` },
                        { translateX: currentSize / 4 * -1 },
                      ],
                    },
                    halfCircleStyle,
                  ]}
                />
              );
            })}

          <Animated.View
            style={[
              style.imageWrapper,
              {
                top: -(currentSize / 15),
                transform: [{ rotate }],
              },
              imageWrapperStyle,
            ]}
          >
            <Image
              style={[
                style.image,
                {
                  width: currentSize,
                  height: currentSize,
                },
                imageStyle,
              ]}
              source={needleImage}
            />
          </Animated.View>
          <View
            style={[
              style.innerCircle,
              {
                width: currentSize * 0.9,
                height: (currentSize / 2) * 0.9,
                borderTopLeftRadius: currentSize / 2,
                borderTopRightRadius: currentSize / 2,
              },
              innerCircleStyle,
            ]}
          />
        </LinearGradient>

        <View style={[style.labelWrapper, labelWrapperStyle]}>
          <Text style={[style.label, labelStyle]}>
            {limitValue(value, minValue, maxValue, this.props.allowedDecimals)}
          </Text>
        </View>
      </View>
    );
  }
}

export default Speedmeter;
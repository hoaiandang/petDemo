import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  PanResponder,
  Animated, } from 'react-native';

export default class Draggable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      showDraggable: true,
      dropAreaValues: null,
      pan: new Animated.ValueXY(),
      opacity: new Animated.Value(1)
    };
  }


  

  componentWillMount() {
    // Add a listener for the delta value change
    this._val = { x:0, y:0 }
    this.state.pan.addListener((value) => this._val = value);
    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this.state.pan.setOffset({
          x: this._val.x,
          y: this._val.y
        })
        this.state.pan.setValue({ x:0, y:0})
      },
      onPanResponderMove: (e, gesture) => {
        Animated.event([
          null, { dx: this.state.pan.x, dy: this.state.pan.y }
        ])(e, gesture);
      },

      onPanResponderRelease: (e, gesture) => {
        if (this.isDropArea(gesture)) {
          Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 1000
        }).start(() => {
          this.setState({
             showDraggable: false
          })}
        );
      } else {
        Animated.spring(this.state.pan, {
          toValue: { x: 0, y: 0 },
          friction: 5
        }).start();
      }
    }
      // adjusting delta value
      //this.state.pan.setValue({ x:0, y:0 })
    });

  }

  isDropArea(gesture) {
    return gesture.moveY < 200;
  }

  wrapper(e, gesture) {
    Animated.event([
        null, { dx: this.state.pan.x, dy: this.state.pan.y }
      ]);
    //this.state.pan.setValue({ x:0, y:0 });
  }

  render() {
    return (
    	<View style={{ width: "20%", alignItems: "center" }}>
       		{this.renderDraggable()}
       	</View>
    );
  }

  renderDraggable() {
  	const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }
    if (this.state.showDraggable) {
    	return (
    		<View>
        		<Animated.View
          		{...this.panResponder.panHandlers}
          		style={[styles.circle, panStyle, {opacity:this.state.opacity}]}
        		/>
        	</View>

    	);
    }

  }
}

let CIRCLE_RADIUS = 30;
let styles = StyleSheet.create({
  circle: {
    backgroundColor: "skyblue",
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
  }
});

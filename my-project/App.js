import React, { Component } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Button, 
  TouchableOpacity, 
  TouchableHighlight,
  TouchableWithoutFeedback, 
  Image,
  TextInput } from 'react-native';

class Circle extends Component {
  render() {
    return (
      <View style={styles.circle} />
    );
  }
}

class Eye extends Component {
  constructor(props) {
    super(props);
    this.state = { open: true };
  }

  render() {
    let display = this.state.open ? this.props.text : ' ';
    return (
      <Text>{display}</Text>
    );
  }

}

export default class App extends React.Component {

    constructor(props) {
    super(props)
    this.state = { 
      count: 0, 
      squished: false,
      menuOpened: false,
      text: '',
      line: 0,
      active: false, }
  }

   onPress = () => {
    this.setState({
      count: this.state.count+1
    })
  }

   onSquish = () => {
    this.setState({
      squished: !this.state.squished
    })
  }

  activatePet = () => {
    this.setState ({
      active: !this.state.active
    })
  }

  menuPress = () => {
    this.setState({
      menuOpened: !this.state.menuOpened
    })
  }

  linePress = () => {
    this.setState({
      line: this.state.line + 1
    })
  }


  render() {

    const line1 = 'Name wants to learn more about the world.'
    const line2 = "Tell them about 3 things you're grateful for!"

    return ( 
      <View style={styles.container}>
      {this.state.menuOpened && <View style={this.state.menuOpened ? styles.menu:null}>
          <Text style={styles.title} onPress={this.linePress}>
          {(this.state.line % 2 == 0) ? line1:line2}
          </Text>
          <TextInput
          style={this.state.menuOpened ? {backgroundColor: 'white', padding: 16, 
          borderRadius: 16, width: '50%', margin: 10}:null}
          placeholder="Type here to translate!"
          onChangeText={(text) => this.setState({text})}
        />
        <TextInput
          style={this.state.menuOpened ? {backgroundColor: 'white', padding: 16, 
          borderRadius: 16, width: '50%', margin: 10}:null}
          placeholder="Type here to translate!"
          onChangeText={(text) => this.setState({text})}
        />
        <TextInput
          style={this.state.menuOpened ? {backgroundColor: 'white', padding: 16, 
          borderRadius: 16, width: '50%', margin: 10}:null}
          placeholder="Type here to translate!"
          onChangeText={(text) => this.setState({text})}
        />
        <Text>{this.state.text}</Text>
      </View>}
        <TouchableOpacity 
        activeOpacity={1} 
        style={this.state.squished ? styles.circleSquished:styles.circle} 
        onPress={this.activatePet}
        onPressIn={this.onSquish}
        onPressOut={this.onSquish}>
                    <View style={styles.eyes}>
                        <View style={this.state.squished ? styles.blinked:styles.eye}></View>
                        <View style={this.state.squished ? styles.blinked:styles.eye}></View>
                    </View>
                    <View style={[styles.countContainer]}>
                    </View>
        </TouchableOpacity>
        <View style={this.state.squished ? styles.shadowSquished:styles.shadow}></View>
        {this.state.active && <View style={styles.petBar}>
          <TouchableOpacity style={[styles.petBarItem]}>
          Food
          <Text>Food</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.petBarItem}>
          Sleep
          <Text>Sleep</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.petBarItem}>
          Play
          <Text>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.petBarItem}>
          Wash
          <Text>Wash</Text>
          </TouchableOpacity>
        </View>}
        <TouchableOpacity 
        style={this.state.menuOpened ? styles.gratitudeButtonOpened:styles.gratitudeButton} 
        onPress={this.menuPress}>
        	Gratitude
          <Text>Gratitude</Text>
        </TouchableOpacity>
        <View style={styles.gratitudeButtonShadow}></View>
      </View>
      
    );
  }
}




var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A8DADC',
    alignItems: 'center',
    justifyContent: 'center',

  }, menu: {
    flex: 1,
    backgroundColor: '#1D3557',
    //backgroundColor: '#E63946',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 2,

  }, title: {
    color: 'white',
    fontWeight: "bold",
    fontSize: 30,
    textAlign: 'center',
    margin: 50,
    top: -50,

  }, petBar: {
    backgroundColor: '#1D3557',
    position: 'relative',
    height: 80,
    top: '50%',
    borderRadius: 200,
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5,

  }, petBarItem: {
    backgroundColor: '#457B9D',
    height: 60,
    width: 60,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 30,
    marginLeft: 5,
    marginRight: 5,

  }, circle: {
    width: 200,
    height: 200,
    borderRadius: 200/2,
    backgroundColor: '#F1FAEE',
    borderWidth: 4,
    borderColor: 'black',
    bottom: '37%',
    position: 'absolute',

  }, circleSquished: {
    width: 230,
    height: 170,
    borderRadius: 200/2,
    backgroundColor: '#F1FAEE',
    borderWidth: 4,
    borderColor: 'black',
    bottom: '37%',
    position: 'absolute',

  }, countContainer: {
    alignItems: 'center',
    padding: 10,

  }, countText: {
    color: 'black',

  }, gratitudeButton: {
    zIndex: 4,
    width: 80,
    height: 80,
    borderRadius: 80/2,
    backgroundColor: '#E63946',
    position: 'absolute',
    bottom: '8%',
    right: '10%',
    elevation: 2,

  }, gratitudeButtonShadow: {
    zIndex: 3,
    width: 80,
    height: 80,
    borderRadius: 80/2,
    backgroundColor: '#457B9D',
    position: 'absolute',
    bottom: '7.5%',
    right: '10%',
    elevation: 2,

  }, gratitudeButtonOpened: {
    zIndex: 4,
    width: 80,
    height: 80,
    borderRadius: 80/2,
    backgroundColor: '#F1FAEE',
    position: 'absolute',
    bottom: '8%',
    right: '10%',
    elevation: 2,

  },  eyes: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row'

  }, eye: {
    height: 8,
    width: 8,
    backgroundColor: 'black',
    borderRadius: 8/2,

  }, blinked: {
    height: 4,
    width: 12,
    backgroundColor: 'black',
    borderRadius: 8/2,

   }, shadow: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#457B9D',
    borderRadius: 200/2,
    bottom: '35%',
    zIndex: -1,
    transform: [{scaleX: 3}],

   }, shadowSquished: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#457B9D',
    borderRadius: 200/2,
    bottom: '35%',
    zIndex: -1,
    transform: [{scaleX: 3.5}],
   }

});

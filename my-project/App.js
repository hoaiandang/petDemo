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
  TextInput,
  AsyncStorage,
  Alert } from 'react-native';

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
      petBarActive: false, 
      feedingActive: false,
      sleepingActive: false,
      playingActive: false,
      washingActive: false,
      }
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
      petBarActive: !this.state.petBarActive
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

  componentDidMount() {
    AsyncStorage.getItem("myKey").then((value) => {
      this.setState({"myKey": value});
    }).done();

    AsyncStorage.getItem("fed").then((value) => {
      this.setState({"fed": JSON.parse(value)});
    }).done();
    AsyncStorage.getItem("rested").then((value) => {
      this.setState({"rested": JSON.parse(value)});
    }).done();
    AsyncStorage.getItem("entertained").then((value) => {
      this.setState({"entertained": JSON.parse(value)});
    }).done();
    AsyncStorage.getItem("washed").then((value) => {
      this.setState({"washed": JSON.parse(value)});
    }).done();

    AsyncStorage.getItem("lastFed").then((value) => {
      this.setState({"lastFed": JSON.parse(value)});
    }).done();
    AsyncStorage.getItem("lastRested").then((value) => {
      this.setState({"lastRested": JSON.parse(value)});
    }).done();
    AsyncStorage.getItem("lastEntertained").then((value) => {
      this.setState({"lastEntertained": JSON.parse(value)});
    }).done();
    AsyncStorage.getItem("lastWashed").then((value) => {
      this.setState({"lastWashed": JSON.parse(value)});
    }).done();

    setTimeout( () => { setInterval( () => {this.setTodaysDate();}, 1000); }, 0 );


  }

//this calculates the time everysecond, and compares it to the last time 
//the pet was cared for in each of its needs, if the time now is greater than the time then, it sets its
//cared for attribute to false
  setTodaysDate() {
    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    var day = new Date().getDate();
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var seconds = new Date().getSeconds();

    {(month < 10) ? month = 0 + "" + month:null }
    {(day < 10) ? day = 0 + "" + day:null }
    {(hours < 10) ? hours = 0 + "" + hours:null }
    {(minutes < 10) ? minutes = 0 + "" + minutes:null }
    {(seconds < 10) ? seconds = 0 + "" + seconds:null }

    var date = year + "" + month + "" + day + "" + hours + "" + minutes + "" + seconds;

    this.setState({ todaysDate: date });

      {(this.state.lastFed < this.state.todaysDate) ? this.setState({ fed: false }):null};
      {(this.state.lastRested < this.state.todaysDate) ? this.setState({ rested: false }):null}; 
      {(this.state.lastEntertained < this.state.todaysDate) ? this.setState({ entertained: false }):null}; 
      {(this.state.lastWashed < this.state.todaysDate) ? this.setState({ washed: false }):null};  
      AsyncStorage.setItem("fed", JSON.stringify(this.state.fed));
      AsyncStorage.setItem("rested", JSON.stringify(this.state.rested));
      AsyncStorage.setItem("entertained", JSON.stringify(this.state.entertained));
      AsyncStorage.setItem("washed", JSON.stringify(this.state.washed));
    
    
  }

  safelyLogTodaysDate() {
    console.log(this.state.todaysDate);
  }


  saveData(value) {
    AsyncStorage.setItem("myKey", value);
    this.setState({"myKey": value});
  }

  feed() {
    AsyncStorage.setItem("fed", JSON.stringify(true));
    this.setState({"fed": true});

    AsyncStorage.setItem("lastFed", JSON.stringify(this.state.todaysDate));
    this.setState({"lastFed": this.state.todaysDate});

    this.setState({"feedingActive": !this.state.feedingActive});
    this.setState({"sleepingActive": false});
    this.setState({"playingActive": false});
    this.setState({"washingActive": false});

  }

  sleep() {
    AsyncStorage.setItem("rested", JSON.stringify(true));
    this.setState({"rested": true});

    AsyncStorage.setItem("lastRested", JSON.stringify(this.state.todaysDate));
    this.setState({"lastRested": this.state.todaysDate});

    this.setState({"feedingActive": false});
    this.setState({"sleepingActive": !this.state.sleepingActive});
    this.setState({"playingActive": false});
    this.setState({"washingActive": false});
  }

  play() {
    AsyncStorage.setItem("entertained", JSON.stringify(true));
    this.setState({"entertained": true});

    AsyncStorage.setItem("lastEntertained", JSON.stringify(this.state.todaysDate));
    this.setState({"lastEntertained": this.state.todaysDate});

    this.setState({"feedingActive": false});
    this.setState({"sleepingActive": false});
    this.setState({"playingActive": !this.state.playingActive});
    this.setState({"washingActive": false});
  }

  wash() {
    AsyncStorage.setItem("washed", JSON.stringify(true));
    this.setState({"washed": true});

    AsyncStorage.setItem("lastWashed", JSON.stringify(this.state.todaysDate));
    this.setState({"lastWashed": this.state.todaysDate});

    this.setState({"feedingActive": false});
    this.setState({"sleepingActive": false});
    this.setState({"playingActive": false});
    this.setState({"washingActive": !this.state.washingActive});
  }




  render() {

    var line1 = 'Name wants to learn more about the world.'
    var line2 = "Tell them about 3 things you're grateful for!"
    var backgroundStyle;
    var shadowStyle;
    var shadowSquishedStyle;
    {this.state.petBarActive ? 
    this.state.feedingActive ? backgroundStyle = [styles.container, { backgroundColor: '#CC7E85' }]:
    this.state.sleepingActive ? backgroundStyle = [styles.container, { backgroundColor: '#00A878' }]:
    this.state.playingActive ? backgroundStyle = [styles.container, { backgroundColor: '#F4A259' }]:
    this.state.washingActive ? backgroundStyle = [styles.container, { backgroundColor: '#F4E285' }]:
    backgroundStyle = styles.container:backgroundStyle = styles.container };

    {this.state.petBarActive ? 
    this.state.feedingActive ? shadowStyle = [styles.shadow, { backgroundColor: '#684551' }]:
    this.state.sleepingActive ? shadowStyle = [styles.shadow, { backgroundColor: '#0B5351' }]:
    this.state.playingActive ? shadowStyle = [styles.shadow, { backgroundColor: '#AA5042' }]:
    this.state.washingActive ? shadowStyle = [styles.shadow, { backgroundColor: '#A49966' }]:
    shadowStyle = styles.shadow:shadowStyle = styles.shadow };

    {this.state.petBarActive ? 
    this.state.feedingActive ? shadowSquishedStyle = [styles.shadowSquished, { backgroundColor: '#684551' }]:
    this.state.sleepingActive ? shadowSquishedStyle = [styles.shadowSquished, { backgroundColor: '#0B5351' }]:
    this.state.playingActive ? shadowSquishedStyle = [styles.shadowSquished, { backgroundColor: '#F4A259' }]:
    this.state.washingActive ? shadowSquishedStyle = [styles.shadowSquished, { backgroundColor: '#F4E285' }]:
    shadowSquishedStyle = styles.shadowSquished:shadowSquishedStyle = styles.shadowSquished };

    return ( 
      <View style={backgroundStyle}>
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
        <View style={this.state.squished ? shadowSquishedStyle:shadowStyle}></View>
        {this.state.petBarActive &&
          <View style={styles.petBar}>
            <TouchableOpacity style={[styles.petBarItem]} onPress={() => this.feed()}>
              Feed
              <Text>Feed</Text>
              {this.state.fed ? <Text>True</Text>:<Text>False</Text>}
              <Text>{this.state.lastFed}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.petBarItem} onPress={() => this.sleep()}>
              Sleep
              <Text>Sleep</Text>
              {this.state.rested ? <Text>True</Text>:<Text>False</Text>}
              <Text>{this.state.lastRested}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.petBarItem} onPress={() => this.play()}>
              Play
              <Text>Play</Text>
              {this.state.entertained ? <Text>True</Text>:<Text>False</Text>}
              <Text>{this.state.lastEntertained}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.petBarItem} onPress={() => this.wash()}>
              Wash
              <Text>Wash</Text>
              {this.state.washed ? <Text>True</Text>:<Text>False</Text>}
              <Text>{this.state.lastWashed}</Text>
            </TouchableOpacity>
          </View>
        }
        <TouchableOpacity 
        style={this.state.menuOpened ? styles.gratitudeButtonOpened:styles.gratitudeButton} 
        onPress={this.menuPress}>
        	Gratitude
          <Text>Gratitude</Text>
          <Text>Now:</Text>
          <Text>{this.state.todaysDate}</Text>
        </TouchableOpacity>
        <View style={styles.gratitudeButtonShadow}></View>
      </View>
      
    );
  }
}


"use strict";

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

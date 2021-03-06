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
import Draggable from "./Draggable";

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

class PetStatus extends Component {
  constructor(props) {
    super(props);
  }

  renderBar(value, bool) {
    var barLength = value * 20;
    var color;
    if (bool) {
      color = 'green';
    } else {
      color = 'red';
    }
    return(
      <View style={{height: 5, width: barLength, backgroundColor: 'green', marginTop: 10}}></View>
      );
  }

  render() {
    return (
    <View style={{position: 'absolute', top: 50, left: 50}}>
    <Text>{this.props.pet.name}</Text>
      {this.renderBar(this.props.pet.fullness, this.props.pet.isFull())}
      {this.renderBar(this.props.pet.playLv/4, this.props.pet.isEntertained())}
      {this.renderBar(this.props.pet.restLv()/5760, this.props.pet.isRested())}
      {this.renderBar(0)}
      {this.renderBar(1)}
    </View>
      );
  }
}

class Pet {
	constructor(fullness, lastFed, lvl, playLv, lastEntertained, name, wokeUpAt, startedSleepingAt, sleeping, restLvPivot) {
		this.works = false;
		this.fullness = fullness;
    this.lastFed = lastFed;
    this.currentTime = 0;
    this.currentPersonality = 'a';
    this.quality = 100;
    this.species = 'abapo';
    
    this.lvl = lvl;

    this.wokeUpAt = wokeUpAt;
    this.startedSleepingAt = startedSleepingAt;
    this.sleeping = sleeping;
    this.restLvPivot = restLvPivot;

    this.playLv = playLv;
    this.lastEntertained = lastEntertained;
    this.name = name;
	}

	petFeed() {
		this.fullness += 1;
    this.lastFed = this.currentTime;
		console.log(this.fullness);
	}

	isFull() {
		return this.fullness >= 3;
	}

	resetHunger() {
		this.fullness = 0;
	}

  decreaseHunger() {
    if (this.fullness > 0 && !this.sleeping) {
      this.fullness -= 1;
      this.lastFed = this.currentTime;
    }
  }

  updateTime(time) {
    this.currentTime = time;
  }

  canEat() {
    return this.fullness < 5;
  }

  sleep() {
    this.restLvPivot = this.restLv();
    this.sleeping = !this.sleeping;

    AsyncStorage.setItem("restLvPivot", JSON.stringify(this.restLvPivot));
    AsyncStorage.setItem("sleeping", JSON.stringify(this.sleeping));

    if (this.sleeping) {
      this.startedSleepingAt = this.currentTime;
      AsyncStorage.setItem("startedSleepingAt", JSON.stringify(this.startedSleepingAt));
    } else {
      this.wokeUpAt = this.currentTime;
      AsyncStorage.setItem("wokeUpAt", JSON.stringify(this.wokeUpAt));
    }
  }

  isRested() {
    return this.restLv() >= 21600;
  }

  restLv() {
    //rn this is wrong because its treating dates strings as integers (eg 6:00 - 5:30 = 30 vs 600 - 530 = 70)
    var rLv;
    if (!this.sleeping) {
      //while awake, restlv = the amount of energy the pet had when it woke up - the time spent awake
      rLv = this.restLvPivot - (this.currentTime - this.wokeUpAt);
    } else {
      //while sleeping, the amount of energy the pet had when it went to sleep + the time spent sleeping
      rLv = this.restLvPivot + (this.currentTime - this.startedSleepingAt);

    }
    //console.log(rLv);
    if (rLv > 28800) {
      return 28800;
    } else if (rLv < 0) {
      return 0;
    } else {
      return rLv;
    }

  }

  color() {
    if (this.lvl < 5) {
      return '#F1FAEE';
    } else if (this.lvl < 15) {
      return '#D3A588';
    } else {
      return '#7A6563';
    }
    
  }

  petPlay() {
    if (this.playLv < 20) {
      this.playLv += 1;
    }
    this.lastPlayed = this.currentTime;
  }

  isEntertained() {
    return this.playLv >= 5;
  }

  decreaseEntertainment() {
    if (this.playLv > 0) {
      this.playLv -= 1;
      this.lastEntertained = this.currentTime;
    }
  }

  levelUp() {
    this.lvl += 1;
  }

  resetLevel() {
    this.lvl = 0;
  }

  renamePet(text) {
    this.name = text;
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
      active: '',
      pettt: new Pet(),
      //daysAlive (real mode)
      //birthDay
      //secondsAlive (dev mode)
      //birthTime
      //kinda bad

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

  levelPet() {
    var levelTo = this.state.daysCaredFor + 1;
    AsyncStorage.setItem("daysCaredFor", JSON.stringify(levelTo));
    this.setState({"daysCaredFor": levelTo});
    this.state.pettt.levelUp();
    console.log(levelTo);
    console.log(this.state.daysCaredFor);
  }

  resetLevelPet() {
    var levelTo = 0;
    AsyncStorage.setItem("daysCaredFor", JSON.stringify(levelTo));
    this.setState({"daysCaredFor": levelTo});
    this.setState({"nameScreenActive": true});
    this.state.pettt.resetLevel();
    console.log(levelTo);
    console.log(this.state.daysCaredFor);
  }

  pressPet() {
    { this.state.petBarActive ? this.careForPet():this.setState({ petBarActive: true, }); }
  }

  careForPet() {
    { this.state.active == 'feed' ? this.feedPet():
      this.state.active == 'sleep' ? this.restPet():
      this.state.active == 'play' ? this.entertainPet():
      this.state.active == 'wash' ? this.washPet():null
    }
  }

  feedPet() {

    {(!this.state.fed && this.state.rested && this.state.entertained && this.state.washed) ? 
        this.levelPet():null}
  }

  feedPetHelper() {
    AsyncStorage.setItem("fed", JSON.stringify(true));
    this.setState({"fed": true});

    AsyncStorage.setItem("lastFed", JSON.stringify(this.state.todaysDate));
    this.setState({"lastFed": this.state.todaysDate});
  }

  restPet() {
    this.state.pettt.sleep();

    {(this.state.fed && !this.state.rested && this.state.entertained && this.state.washed) ? 
        this.levelPet():null}
  }

  restPetHelper() {
    AsyncStorage.setItem("rested", JSON.stringify(true));
    this.setState({"rested": true});

    AsyncStorage.setItem("lastRested", JSON.stringify(this.state.todaysDate));
    this.setState({"lastRested": this.state.todaysDate});
  }

  entertainPet() {
    {this.state.pettt.sleeping ? null:this.state.pettt.petPlay()}

    {(this.state.fed && this.state.rested && !this.state.entertained && this.state.washed) ? 
        this.levelPet():null}
  }

  entertainPetHelper() {
    AsyncStorage.setItem("entertained", JSON.stringify(true));
    this.setState({"entertained": true});

    AsyncStorage.setItem("lastEntertained", JSON.stringify(this.state.todaysDate));
    this.setState({"lastEntertained": this.state.todaysDate});
  }

  washPet() {
    {this.state.washed ? null:this.washPetHelper()}

    {(this.state.fed && this.state.rested && this.state.entertained && !this.state.washed) ? 
      this.levelPet():null}
  }

  washPetHelper() {
    AsyncStorage.setItem("washed", JSON.stringify(true));
    this.setState({"washed": true});

    AsyncStorage.setItem("lastWashed", JSON.stringify(this.state.todaysDate));
    this.setState({"lastWashed": this.state.todaysDate});
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

  exitNameScreen() {
    this.setState({"nameScreenActive": false});
  }

  renamePet(text) {
    this.state.pettt.renamePet(text);
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

    AsyncStorage.getItem("daysCaredFor").then((value) => {
      this.setState({"daysCaredFor": JSON.parse(value)});
    }).done();

    AsyncStorage.getItem("fullness").then((value) => {
      this.setState({"fullness": JSON.parse(value)});
    }).done();

    AsyncStorage.getItem("playLv").then((value) => {
      this.setState({"playLv": JSON.parse(value)});
    }).done();

    AsyncStorage.getItem("wokeUpAt").then((value) => {
      this.setState({"wokeUpAt": JSON.parse(value)});
    })

    AsyncStorage.getItem("startedSleepingAt").then((value) => {
      this.setState({"startedSleepingAt": JSON.parse(value)});
    })

    AsyncStorage.getItem("sleeping").then((value) => {
      this.setState({"sleeping": JSON.parse(value)});
    })

    AsyncStorage.getItem("restLvPivot").then((value) => {
      this.setState({"restLvPivot": JSON.parse(value)});
    })




    //this.setState({pettt: new Pet(this.state.fullness)});
    //you can't use this.state.fullness here, it will still be undefined

    setTimeout( () => {this.startSetTodaysDate()}, 1 );
    setInterval( () => {this.setTodaysDate();}, 1000);


  }

  startSetTodaysDate() {
  	this.setState({pettt: new Pet(this.state.fullness, this.state.lastFed, this.state.daysCaredFor, 
      this.state.playLv, this.lastEntertained, 'squishy', this.state.wokeUpAt, this.state.startedSleepingAt, 
      this.state.sleeping, this.state.restLvPivot)});
  	console.log(this.state.fullness);
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

    //var date = year + "" + month + "" + day + "" + hours + "" + minutes + "" + seconds;
    var date = Math.floor(new Date().valueOf() / 1000);

    this.setState({ todaysDate: date });
    this.state.pettt.updateTime(date);

      {(this.state.todaysDate - this.state.pettt.lastFed) > 5 ? this.setState({ fed: false }):null};
      
      {(this.state.todaysDate - this.state.lastEntertained) > 5 ? this.setState({ entertained: false }):null}; 
      {(this.state.todaysDate - this.state.lastWashed) > 5 ? this.setState({ washed: false }):null};  
      AsyncStorage.setItem("fed", JSON.stringify(this.state.fed));
      AsyncStorage.setItem("rested", JSON.stringify(this.state.rested));
      AsyncStorage.setItem("entertained", JSON.stringify(this.state.entertained));
      AsyncStorage.setItem("washed", JSON.stringify(this.state.washed));

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

    //var date = year + "" + month + "" + day + "" + hours + "" + minutes + "" + seconds;
    var date = Math.floor(new Date().valueOf() / 1000);

    this.setState({ todaysDate: date });
    this.state.pettt.updateTime(date);

      {(this.state.todaysDate - this.state.pettt.lastFed) > 5 ? this.state.pettt.decreaseHunger():null};
      {(this.state.todaysDate - this.state.pettt.lastEntertained) > 5 ? this.state.pettt.decreaseEntertainment():null};
      
      {(this.state.todaysDate - this.state.lastEntertained) > 5 ? this.setState({ entertained: false }):null}; 
      {(this.state.todaysDate - this.state.lastWashed) > 5 ? this.setState({ washed: false }):null};
      this.setState({fed: this.state.pettt.isFull()});  
      this.setState({rested: this.state.pettt.isRested()});
      this.setState({entertained: this.state.pettt.isEntertained()});  
      AsyncStorage.setItem("fed", JSON.stringify(this.state.fed));
      AsyncStorage.setItem("rested", JSON.stringify(this.state.rested));
      AsyncStorage.setItem("entertained", JSON.stringify(this.state.entertained));
      AsyncStorage.setItem("washed", JSON.stringify(this.state.washed));
      AsyncStorage.setItem("fullness", JSON.stringify(this.state.pettt.fullness));
      AsyncStorage.setItem("playLv", JSON.stringify(this.state.pettt.playLv));
      AsyncStorage.setItem("lastFed", JSON.stringify(this.state.pettt.lastFed));

    
    
  }

  safelyLogTodaysDate() {
    console.log(this.state.todaysDate);
  }


  saveData(value) {
    AsyncStorage.setItem("myKey", value);
    this.setState({"myKey": value});
  }

  feed() {
    { this.state.active == 'feed' ? 
      this.setState({ active: '' }):this.setState({ active: 'feed' }) 
    };


  }


  sleep() {
    { this.state.active == 'sleep' ? 
      this.setState({ active: '' }):this.setState({ active: 'sleep' }) 
    };
  }

  play() {
    { this.state.active == 'play' ? 
      this.setState({ active: '' }):this.setState({ active: 'play' }) 
    };
  }

  wash() {
    { this.state.active == 'wash' ? 
      this.setState({ active: '' }):this.setState({ active: 'wash' }) 
    };
  }

  LevelUpIfAllTrue() {
    //levels up the pet if all of its needs are met
    {this.state.fed ? 
      this.state.rested ? 
        this.state.entertained ? 
          this.state.washed ? 
            this.setState({ daysAlive: this.state.daysAlive + 1 }):null
          :null
        :null
     :null}
  }


  render() {

    const lvl = {
      backgroundColor: this.state.pettt.color(),
    }
    var draggable1 = new Draggable();
    var line1 = this.state.pettt.name + ' wants to learn more about the world.'
    var line2 = "Tell them about 3 things you're grateful for!"
    var backgroundStyle;
    var shadowStyle;
    var shadowSquishedStyle;
    {this.state.petBarActive ? 
    this.state.active == 'feed' ? backgroundStyle = [styles.container, { backgroundColor: '#CC7E85' }]:
    this.state.active == 'sleep' ? backgroundStyle = [styles.container, { backgroundColor: '#00A878' }]:
    this.state.active == 'play' ? backgroundStyle = [styles.container, { backgroundColor: '#F4A259' }]:
    this.state.active == 'wash' ? backgroundStyle = [styles.container, { backgroundColor: '#F4E285' }]:
    backgroundStyle = styles.container:backgroundStyle = styles.container };

    {this.state.petBarActive ? 
    this.state.active == 'feed' ? shadowStyle = [styles.shadow, { backgroundColor: '#684551' }]:
    this.state.active == 'sleep' ? shadowStyle = [styles.shadow, { backgroundColor: '#0B5351' }]:
    this.state.active == 'play' ? shadowStyle = [styles.shadow, { backgroundColor: '#AA5042' }]:
    this.state.active == 'wash' ? shadowStyle = [styles.shadow, { backgroundColor: '#A49966' }]:
    shadowStyle = styles.shadow:shadowStyle = styles.shadow };

    {this.state.petBarActive ? 
    this.state.active == 'feed' ? shadowSquishedStyle = [styles.shadowSquished, { backgroundColor: '#684551' }]:
    this.state.active == 'sleep' ? shadowSquishedStyle = [styles.shadowSquished, { backgroundColor: '#0B5351' }]:
    this.state.active == 'play' ? shadowSquishedStyle = [styles.shadowSquished, { backgroundColor: '#AA5042' }]:
    this.state.active == 'wash' ? shadowSquishedStyle = [styles.shadowSquished, { backgroundColor: '#A49966' }]:
    shadowSquishedStyle = styles.shadowSquished:shadowSquishedStyle = styles.shadowSquished };

    return ( 
      <TouchableOpacity activeOpacity={1} style={backgroundStyle} onPress={() => {this.setState({ petBarActive: false });}}>
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
      <PetStatus pet={this.state.pettt}></PetStatus>
      <TouchableOpacity 
        activeOpacity={1} 
        style={[this.state.squished ? styles.circleSquished:styles.circle, lvl]} 
        onPress={() => this.pressPet()}
        onPressIn={this.onSquish}
        onPressOut={this.onSquish}>
                    <View style={styles.eyes}>
                        <View style={this.state.squished || this.state.pettt.sleeping ? styles.blinked:styles.eye}></View>
                        <View style={this.state.squished || this.state.pettt.sleeping ? styles.blinked:styles.eye}></View>
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
              <Text>{this.state.pettt.lastFed}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.petBarItem} onPress={() => this.sleep()}>
              Sleep
              <Text>Sleep</Text>
              {this.state.rested ? <Text>True</Text>:<Text>False</Text>}
              <Text>{this.state.pettt.restLv()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.petBarItem} onPress={() => this.play()}>
              Play
              <Text>Play</Text>
              {this.state.entertained ? <Text>True</Text>:<Text>False</Text>}
              <Text>{this.state.lastEntertained}</Text>
              <Text>{this.state.pettt.playLv}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.petBarItem} onPress={() => this.wash()}>
              Wash
              <Text>Wash (take out)</Text>
              {this.state.washed ? <Text>True</Text>:<Text>False</Text>}
              <Text>{this.state.lastWashed}</Text>
            </TouchableOpacity>
          </View>
        }
        {this.state.petBarActive && (this.state.active == 'feed') &&
          <View style={styles.petBar}>
            <Draggable pet={this.state.pettt} style={styles.food}/>
            <Draggable pet={this.state.pettt} style={styles.food}/>
            <Draggable pet={this.state.pettt} style={styles.food}/>
            <Draggable pet={this.state.pettt} style={styles.food}/>

          </View>
        }
        <TouchableOpacity 
        style={this.state.menuOpened ? styles.gratitudeButtonOpened:styles.gratitudeButton} 
        onPress={this.menuPress}>
        	Gratitude
          <Text>Gratitude</Text>
          <Text>Now:</Text>
          <Text>{this.state.todaysDate}</Text>
          <Text>{this.state.daysCaredFor}</Text>
          <Text>{this.state.active}</Text>   
          <Text>{this.state.pettt.fullness}</Text>
          <Text>{JSON.stringify(this.state.pettt.sleeping)}</Text>
        </TouchableOpacity>
        <View style={styles.gratitudeButtonShadow}></View>
        <TouchableOpacity 
        style={styles.resetLevelButton} 
        onPress={() => this.resetLevelPet()}>
          id:resetLevel
          <Text>Reset Level</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style={styles.levelUpButton} 
        onPress={() => this.levelPet()}>
          id:levelUp
          <Text>Level Up</Text>
          <Text>{this.state.pettt.lvl}</Text>
        </TouchableOpacity>

        {this.state.nameScreenActive && 
          <View style={styles.nameScreen}>
            id:nameScreen
            <TextInput
              style={{backgroundColor: 'white', padding: 20,  
              borderRadius: 16, width: '60%',  zIndex: 1}}
              placeholder="Name your pet"
              onChangeText={(text) => this.state.pettt.renamePet(text)}
            />
            <View style={styles.nameScreenBackground}>
              id:nameScreenBackground
            </View>
            <TouchableOpacity 
              style={styles.exitNameScreenButton} 
              onPress={() => this.exitNameScreen()}>
              id:exitNameScreen
              <Text style={{color: 'white', fontSize: 32, textAlign: 'center'}}>X</Text>
            </TouchableOpacity>
          </View>
        }
      </TouchableOpacity>
      
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
    //flex: 1,
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
    paddingTop: 10,
    paddingBottom: 10,

  }, petBarItem: {
    backgroundColor: '#457B9D',
    height: 60,
    width: 60,
    borderRadius: 30,
    marginLeft: 5,
    marginRight: 5,

  }, food: {
    marginTop: 10,

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

   }, resetLevelButton: {
    width: 40,
    height: 40,
    borderRadius: 40/2,
    backgroundColor: '#E63946',
    position: 'absolute',
    bottom: '8%',
    left: '15%',

   }, levelUpButton: {
    width: 40,
    height: 40,
    borderRadius: 40/2,
    backgroundColor: '#E63946',
    position: 'absolute',
    bottom: '8%',
    left: '30%',

   }, name: {
    bottom: '30%',
    position: 'absolute',
    fontSize: 36,
    color: 'white',

   }, nameScreen: {
    height: '100%',
    width: '100%',
    //backgroundColor: 'black',
    zIndex: 2,
    //opacity: 0.5,
    
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    //backgroundColor: 'blue',

   }, nameScreenBackground: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
    //zIndex: 4,
    opacity: 0.5,
    position: 'absolute',
    //left: 0,
    //top: 0,

   }, exitNameScreenButton: {
    width: 40,
    height: 40,
    borderRadius: 40/2,
    //backgroundColor: '#E63946',
    position: 'absolute',
    top: '10%',
    right: '10%',
    zIndex: 1,

   },

});

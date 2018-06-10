import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';

/*
export default class App extends Component {

  tryMe(value) {
    return (<Text>{ value }</Text>);
  }

  render() {
    var trying = this.tryMe('hello');
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        { trying }
      </View>
    );
  }
}
*/


"use strict";

/*
var ReactProject = React.createElement({

    componentDidMount() {
        AsyncStorage.getItem("myKey").then((value) => {
            this.setState({"myKey": value});
        }).done();
    },

    getInitialState: function() {
        return { };
    },

    render: function() {
        return (
            <View style={styles.container}>
                <Text style={styles.saved}>
                    {this.state.myKey}
                </Text>
                <View>
                    <TextInput
                        style={styles.formInput}
                        onChangeText={(text) => this.saveData(text)}
                        value="" />
                </View>
                <Text style={styles.instructions}>
                    Type something into the text box. It will be saved to
                    device storage. Next time you open the application, the saved data
                    will still exist.
                </Text>
            </View>
        );
    },

    saveData: function(value) {
        AsyncStorage.setItem("myKey", value);
        this.setState({"myKey": value});
    }

});
*/

//src https://www.thepolyglotdeveloper.com/2015/09/saving-data-in-your-react-native-mobile-application/


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  feed = () => {
    
console.log(this.state.fed);
//    this.saveFeed(fed);
    
    
  }


  componentDidMount() {

    AsyncStorage.getItem("fed").then((value) => {
      this.setState({ "fed": JSON.parse(value), });
    }).done();

/*
AsyncStorage.getItem('key', (value) => {
    JSON.parse(value) // boolean false
})
*/


    AsyncStorage.getItem("myKey").then((value) => {
      this.setState({"myKey": value,});
    }).done();
    AsyncStorage.getItem("level").then((value) => {
      this.setState({ "level": JSON.parse(value) ,});
    }).done();
  }


  saveData(value) {
    // Saves to storage as a JSON-string
    //AsyncStorage.setItem('key', JSON.stringify(false))

// Retrieves from storage as boolean
    //AsyncStorage.getItem('key', (value) => {JSON.parse(value) // boolean false})
    AsyncStorage.setItem("myKey", value);
    this.setState({"myKey": value});
    this.saveFeed();

  }

  saveFeed() {

    console.log(this.state.fed);
    console.log(this.state.level);

    {this.state.fed ? 
      this.setState({
      fed: !this.state.fed,
    }): this.setState({
      fed: !this.state.fed,
      level: this.state.level+1,
    }) };


    console.log(this.state.fed);
    console.log(this.state.level);

    console.log(" ");

    Alert.alert("this works!!");

    AsyncStorage.setItem("fed", JSON.stringify(!this.state.fed));
    AsyncStorage.setItem("level", JSON.stringify(this.state.level));
  }


  render() {
        return (
            <View style={styles.container}>
                <Text style={styles.saved}>
                    {this.state.myKey}
                </Text>
                <Text style={styles.saved}>
                    {this.state.fed}
                </Text>
                <Text style={styles.saved}>
                    {this.state.level}
                </Text>
                <View>
                
                    <TextInput
                        style={styles.formInput}
                        onChangeText={(text) => this.saveData(text)}
                        value="" />

                </View>

                <TouchableOpacity style={{height: 50, width: 50, backgroundColor: 'red'}} onPress={ () => this.saveFeed() }>
                  <Text>feed</Text>
                  <Text>{this.state.fed && this.state.level}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{height: 50, width: 50, backgroundColor: 'blue'}}>
                  <Text>sleep</Text>
                </TouchableOpacity>

                <Text style={styles.instructions}>
                    Type something into the text box. It will be saved to
                    device storage. Next time you open the application, the saved data
                    will still exist.
                </Text>
            </View>
        );
    }

}



var styles = StyleSheet.create({
    container: {
        padding: 30,
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        backgroundColor: "#F5FCFF",
    },
    formInput: {
        height: 50,
        fontSize: 13,
        borderWidth: 1,
        borderColor: "#555555",
    },
    saved: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
        marginTop: 5,
    },
});

//AppRegistry.registerComponent('ReactProject', () => ReactProject);

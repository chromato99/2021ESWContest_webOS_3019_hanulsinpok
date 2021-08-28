/*
 * Copyright (c) 2020 LG Electronics Inc.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

// helloworld_webos_service.js
// is simple service, based on low-level luna-bus API

// eslint-disable-next-line import/no-unresolved
const pkgInfo = require('./package.json');
const Service = require('webos-service');

const service = new Service(pkgInfo.name); // Create service by service name on package.json
const logHeader = "[" + pkgInfo.name + "]";
let greeting = "Hello, World!";

const path = require('path');
const GoogleAssistant = require('google-assistant');

const config = {
  auth: {
    keyFilePath: path.resolve(__dirname, 'credentials.json'),
    savedTokensPath: path.resolve(__dirname, 'devicecredentials.json'), // where you want the tokens to be saved
  },
  conversation: {
    lang: 'en-US', // defaults to en-US, but try other ones, it's fun!
    showDebugInfo: false, // default is false, bug good for testing AoG things
    textQuery: '',
  },
};

const startConversation = (conversation) => {
    // setup the conversation
    conversation
      .on('response', text => console.log('Assistant Response:', text))
      .on('debug-info', info => console.log('Debug Info:', info))
      // if we've requested a volume level change, get the percentage of the new level
      .on('volume-percent', percent => console.log('New Volume Percent:', percent))
      // the device needs to complete an action
      .on('device-action', action => console.log('Device Action:', action))
      // once the conversation is ended, see if we need to follow up
      .on('ended', (error, continueConversation) => {
        if (error) {
          console.log('Conversation Ended Error:', error);
        } else if (continueConversation) {
          promptForInput();
        } else {
          console.log('Conversation Complete');
          conversation.end();
        }
      })
      // catch any errors
      .on('error', (error) => {
        console.log('Conversation Error:', error);
      });
};
const assistant = new GoogleAssistant(config.auth);

// a method that always returns the same value
service.register("turnOn", function(message) {
    console.log(logHeader, "SERVICE_METHOD_CALLED:/turnOn");
    console.log("In hello callback");
    const device_name = message.payload.device_name ? message.payload.device_name : "nothing";

    assistant
    .on('ready', () => {

        config.conversation.textQuery = "Turn on " + device_name + "!";
        assistant.start(config.conversation, startConversation);
        message.respond({
        returnValue: true,
        device_name: device_name,
        response: "Turn On " + device_name + "!"
        })
    
    })
    .on('error', (error) => {
      console.log('Assistant Error:', error);
      message.respond({
        returnValue: false,
        response: error
        })
    });
});

service.register("hello", function(message) {
    console.log(logHeader, "SERVICE_METHOD_CALLED:/hello");
    console.log("In hello callback");
    const name = message.payload.name ? message.payload.name : "World";

    message.respond({
        returnValue: true,
        Response: "Hello, " + name + "!"
    });
});
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

const API = {
  subscribeToUser: (userId, cb) => {
    let c = 0;
    return setInterval(() => cb(`Message # ${++c} from user ${userId}`), 1000);
  },
  unSubscribe: subID => {
    clearInterval(subID);
  }
};

class MyCmp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timesTamp: new Date(),
      messages: []
    };
    this.subscription = API.subscribeToUser(this.props.userId, message =>
      this.setState(state => ({ messages: [...state.messages, message] }))
    );

    this.timerId = setInterval(
      () => this.setState({ timesTamp: new Date() }),
      1000
    );
  }

  componentWillUnmount() {
    API.unSubscribe(this.subscription);
    clearInterval(this.timerId);
  }

  render() {
    console.log("cmp render");
    const { userId } = this.props;
    const { messages } = this.state;
    return (
      <div>
        //<div>{this.state.timesTamp.toLocaleTimeString()}</div>
        <h3>messages from user {userId}</h3>
        <ul>
          {messages.map((message, i) => (
            <li key={i}>{message}</li>
          ))}
        </ul>
      </div>
    );
  }
}

class App extends Component {
  state = {
    renderCmp: true
  };
  render() {
    console.log("app render");
    const { renderCmp } = this.state;
    return (
      <>
        <div>
          <button onClick={() => this.setState({ renderCmp: false })}>
            kill cmp
          </button>
          {/* <button onClick={() => this.setState({ renderCmp: false })}>
            switch user1
          </button> */}
        </div>
        {renderCmp ? <MyCmp userId="10002" /> : <p>good bye</p>}
      </>
    );
  }
}

export { App };

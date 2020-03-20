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
      ...this.getEmptyMessagesStateUpdate()
    };
    this.subscribeToUser(this.props.userId);
    this.timerId = setInterval(
      () => this.setState({ timesTamp: new Date() }),
      1000
    );
  }

  getEmptyMessagesStateUpdate() {
    return { messages: [] };
  }
  subscribeToUser(userId) {
    this.subscription = API.subscribeToUser(userId, message =>
      this.setState(state => ({ messages: [...state.messages, message] }))
    );
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.userId !== nextProps.userId) {
      console.log("userId gonna changed");

      API.unSubscribe(this.subscription);
      this.subscribeToUser(nextProps.userId);
      this.setState(this.getEmptyMessagesStateUpdate());
    }
  }

  componentWillUnmount() {
    API.unSubscribe(this.subscription);
    clearInterval(this.timerId);
  }

  render() {
    console.log("cmp render");
    const { userId } = this.props;
    const { messages } = this.state;
    console.log(userId);
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
    renderCmp: true,
    userId: "1"
  };
  render() {
    console.log("app render");
    const { renderCmp, userId } = this.state;
    return (
      <>
        <div>
          <button onClick={() => this.setState({ renderCmp: false })}>
            kill cmp
          </button>
          <button onClick={() => this.setState({ userId: "2222" })}>
            switch user1
          </button>
        </div>
        {renderCmp ? <MyCmp userId={userId} /> : <p>good bye</p>}
      </>
    );
  }
}

export { App };

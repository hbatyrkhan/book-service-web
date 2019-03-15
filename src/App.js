import React, { Component } from 'react';
import './App.css';
import User from './components/User';
import BookList from './components/BookList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <User />
        <BookList />
      </div>
    );
  }
}

export default App;

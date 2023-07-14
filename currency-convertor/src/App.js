import React, { Component } from 'react';
import './App.css';
import CurrencyConvertor from './components/CurrencyConvertor'

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="header">
        </div>
        <CurrencyConvertor />
      </div>
    );
  }
}

export default App;
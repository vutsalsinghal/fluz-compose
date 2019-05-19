import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import CalorieIntake from './components/CalorieIntake';
import CalorieSpent from './components/CalorieSpent';
import Friends from './components/Friends';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/intake" component={CalorieIntake} />
            <Route exact path="/spent" component={CalorieSpent} />
            <Route exact path="/friends" component={Friends} />
          </Switch>
        </Layout>
      </HashRouter>
    );
  }
}

export default App;
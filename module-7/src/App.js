import { Component } from "react";
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import {Container,Menu} from 'semantic-ui-react';
import Home from './Components/Home';
import Campaign from './Components/Campaign';
import NotFound from './Components/NotFound';
import 'semantic-ui-css/semantic.min.css'
import './App.css';

class App extends Component {
  render() {
  return (
    <Router>
      <Container>
        <Menu>
            <Menu.Item><Link 
            to="/">Home</Link></Menu.Item>
          {/* <Link 
            to="/">Home</Link> */}
        </Menu>

        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/campaign/:address" component={Campaign}/>
          <Route component={NotFound}/>
        </Switch>
      </Container>
    </Router>
  );
  }

navigateToHome(e) {
  e.preventDefault();
  Window.history.push('/');
}

}
export default App;

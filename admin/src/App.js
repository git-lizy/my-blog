import React from 'react';
import './App.css';
import AppRouter from './router/router'
import { HashRouter as Router,Switch,Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          {AppRouter.map(item=>{
            return <Route exact={item.exact} key={item.path} path={item.path} render={props=><item.component {...props} child={item.child}/>}/>
          })}
        </Switch>
      </Router>

    </div>
  );
}

export default App;

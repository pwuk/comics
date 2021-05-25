import './App.css';

import { HashRouter as Router, Route } from 'react-router-dom';
import {Comics} from './Comics';
import {Login} from './Login';
import {Admin} from './Admin';
import React from 'react';
import {PrivateRoute} from './PrivateRoute';

import AuthContext from './Context';



function App() {

  const [auth, setAuth] = React.useState("")
  console.log('auth', auth)

  return (
    <AuthContext.Provider value={{auth, setAuth}} >
     <header className="App-header">
        <div className="App">
        Comics Database
        <Router>
          <Route path = '/' exact component={Comics} />
          <PrivateRoute path = '/admin' component={Admin}/>
          <Route path = '/login' component={Login}/>
        </Router>
        </div>
     </header>
   </AuthContext.Provider>
  );


}

export default App;

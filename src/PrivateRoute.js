import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import React, { useContext } from 'react';
import AuthContext from './Context';

export function PrivateRoute ({ component: Component, ...rest }) {

	const context = useContext(AuthContext);

  return <Route {...rest} render={(props) => {
  		return context.auth ? <Component {...props} /> : <Redirect to='/login' {...rest} />
  }
  	} />
}
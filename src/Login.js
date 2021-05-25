import React, { useState, useEffect } from 'react';
import AuthContext from './Context';

export function Login(props) {
	const [name, setName] = useState('');
	const [key, setKey] = useState('');
	const [pwd, setPwd] = useState('');
	const [loginErr, setLoginErr] = useState(false);
	console.log(props)

	const validateForm = ()=> name.length && pwd.length;

	const handleChange = (e) => {
		(e.target.type === 'password') && setPwd(e.target.value);
		(e.target.type === 'text') && setName(e.target.value);
		setLoginErr(false);
	};

	const context = React.useContext(AuthContext);

	useEffect( ()=>{
	}, []);

	const loginAttempt = () => { 
      fetch(`https://paulskilton.co.uk/comics/getLogin.php?u=${name}&p=${pwd}`).then(r=>r.json()).then(result=>{
        setKey(result.data.UID);
        setLoginErr(!result.data.UID);
        context.setAuth(result.data.UID);
        !!result.data.UID && props.history.push('/admin')
	  });
  	}

	return  (
		<div className="Login">
        <form onSubmit={(e)=>e.preventDefault()}>
          <div>
            <label>Email</label>
            <input 
              autoFocus
              type="text"
              value={name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              value={pwd}
              onChange={handleChange}
              type="password"
            />
          </div>
          {
          	loginErr && <div className="loginErr">Credentials do not match</div>
          }
          <button
            onClick={loginAttempt}
            disabled={!validateForm()}
            type="submit"
          >
            Login
          </button>
        </form>
      	</div>
	);

};
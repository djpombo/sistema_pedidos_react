import React from 'react';
import { useState, useContext } from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

import {AuthContext} from '../../contexts/auth';

import './signin.css';
import { toast } from 'react-toastify';


function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loadingAuth } = useContext(AuthContext);
  
  function handleSubmit(e){
    e.preventDefault();
    if(email !== '' && password !== ''){
      signIn(email, password);
      
    }else{
      toast.error('Ops! Voce deve preencher os campos!');
    }
  }

  

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="sistema-logo"/>
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Entrar</h1>
          <input type="text" placeholder="teste@teste.com" autoFocus autoComplete="off"
              value={email} onChange={(e)=> setEmail(e.target.value)} />

          <input type="password" placeholder="********" autoComplete="off" 
              value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit">{ loadingAuth ? 'Carregando... ' : 'Entrar'}</button>
        </form>
        <Link to="/register">criar uma conta</Link>

      </div>
    </div>
  );
}

export default SignIn;

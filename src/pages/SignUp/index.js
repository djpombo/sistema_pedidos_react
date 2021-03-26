import React from 'react';
import { useState, useContext } from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';




function SignUp() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUp } = useContext(AuthContext);
  
  
  function handleSubmit(e){
    e.preventDefault();
    if(nome !== '' && email !== '' && password !== ''){
      signUp(email, password, nome);
    }
  }

  

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="sistema-logo"/>
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Criar Conta</h1>

          <input type="text" placeholder="Nome" autoFocus autoComplete="off"
              value={nome} onChange={ (e) => setNome(e.target.value)} />
          <input type="text" placeholder="teste@teste.com" autoComplete="off"
              value={email} onChange={(e)=> setEmail(e.target.value)} />

          <input type="password" placeholder="********" autoComplete="off" 
              value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit">Cadastrar</button>
        </form>
        <Link to="/">Já tem uma conta? Entre</Link>

      </div>
    </div>
  );
}

export default SignUp;

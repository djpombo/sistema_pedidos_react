import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';
import { FiHome, FiUsers, FiSettings, FiDatabase } from "react-icons/fi"

import { Link } from 'react-router-dom';

import './header.css';

export default function Header(){
const { user } = useContext(AuthContext);

    return(
        <div className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatar : user.avatarUrl} alt="foto avatar"/>
                
            </div>
            <Link to="/dashboard">
            <FiHome color="#FFF" size="24"/>
            Chamados
            </Link>

            <Link to="/customers">
            <FiUsers color="#FFF" size="24"/>Add Clientes
            </Link>

            <Link to="/profile">
            <FiSettings color="#FFF" size="24"/>Perfil
            </Link>

            <Link to="/clientsedit">
            <FiDatabase color="#FFF" size="24"/>Admin Clientes
            </Link>
            
        </div>
    );
}
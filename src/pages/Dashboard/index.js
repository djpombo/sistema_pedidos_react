import { useState } from 'react';
//import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Title from '../../components/Title';

//icons
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';

//link do react-router-dom
import { Link } from 'react-router-dom';

import './dashboard.css';

export default function Dashboard() {
    //const { signOut } = useContext(AuthContext);

    const [chamados, setChamados] = useState([1]);

    return (
        <div>
            <Header />
            <div className="content">

                <Title name="Chamados" >
                    <FiMessageSquare size={25} />
                </Title>

                {chamados.length === 0 ? (
                    <div className="container dashboard">
                        <span>Nenhum chamado registrado...</span>
                        <Link to="/novo" className="novo"><FiPlus size={25} color="#FFF" /> Novo Chamado</Link>
                    </div>
                ) :
                    (<>
                        <Link to="/novo" className="novo"><FiPlus size={25} color="#FFF" /> Novo Chamado</Link>
                    
                    <table>
                        <thead>
                            <tr>
                                <th scope='col'>Cliente</th>
                                <th scope='col'>Assunto</th>
                                <th scope='col'>Status</th>
                                <th scope='col'>Cadastrado em</th>
                                <th scope='col'>#</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td data-label="Cliente">Facas Tramontina</td>
                                <td data-label="Assunto">Suporte data center</td>
                                <td data-label="Status">
                                    <span className="badge" style={{backgroundColor: '#5cb85c'}}>Em aberto</span>
                                </td>
                                <td data-label="Cadastrado">17-01-2021</td>
                                <td data-label="#">
                                    <button className="action" style={{backgroundColor: '#3586f3'}}>
                                        <FiSearch color="#FFF" size={17} />
                                    </button>
                                    <button className="action" style={{backgroundColor: '#F6A935'}}>
                                        <FiEdit2 color="#FFF" size={17} />
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td data-label="Cliente">Doceria Hamburguesa</td>
                                <td data-label="Assunto">Implementação modulo 2</td>
                                <td data-label="Status">
                                    <span className="badge" style={{backgroundColor: '#5cb85c'}}>Em aberto</span>
                                </td>
                                <td data-label="Cadastrado">20-03-2021</td>
                                <td data-label="#">
                                    <button className="action" style={{backgroundColor: '#3586f3'}}>
                                        <FiSearch color="#FFF" size={17} />
                                    </button>
                                    <button className="action" style={{backgroundColor: '#F6A935'}}>
                                        <FiEdit2 color="#FFF" size={17} />
                                    </button>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                    
                    </>
            
                    )
                }


            </div>



        </div>
    );
}
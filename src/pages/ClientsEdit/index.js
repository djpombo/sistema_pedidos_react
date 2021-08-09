import React from 'react';

//componentes padrão
import Header from '../../components/Header';
import Title from '../../components/Title';

//icons
import { FiDatabase, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { FaSearchPlus } from 'react-icons/fa';

//useState / Context
import { useState, useContext, useEffect } from 'react';

//banco
import firebase from '../../services/firebaseConnection';

//toast
import { toast } from 'react-toastify';

import { Link } from 'react-router-dom';

//css
import './clientsedit.css';

//Modal
import ModalClients from '../../components/ModalClients';


import { deprecationHandler } from 'moment';



export default function ClientsEdit() {

    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastDoc, setLastDoc] = useState();
    const [isEmpty, setIsEmpty] = useState(false);
    const [loadingMore, setLoadingMore] = useState(true);

    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();


    const listaRef = firebase.firestore().collection('customers');


    useEffect(() => {
        async function loadClients() {
            await listaRef.limit(5)
                .get()
                .then((snapshot) => {

                    upadateState(snapshot);

                }).catch((error) => {
                    toast(`Opa! ocorreu o seguinte erro ${error}`);
                    setLoading(false);
                })
        }

        loadClients();

        return () => {

        }
    },
        []);

    function upadateState(snapshot) {
        const isCollection = snapshot.size === 0;

        if (!isCollection) {

            let lista = [];
            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    nomeFantasia: doc.data().cliente,
                    cnpj: doc.data().cnpj,
                    endereco: doc.data().endereco,
                    nomeFantasia: doc.data().nomeFantasia

                })
            });

            console.log(lista);
            const lastDoc = snapshot.docs[snapshot.docs.length - 1]; //Pegando o ultimo documento buscado

            setClientes(clientes => [...clientes, ...lista]);//pega todos os clientes q já tem e adiciona mais os da lista
            setLastDoc(lastDoc);//salva o ultimo registro do limite de 5
        } else {

            setIsEmpty(true);

        }

        setLoadingMore(false);
        setLoading(false);
    }

    async function handleMore() {
        setLoadingMore(true);

        await listaRef.startAfter(lastDoc).limit(5)
        .get()
        .then((snapshot)=>{

            upadateState(snapshot);

        }).catch((error)=>{

            toast(`Ops! Ocorreu o seguinte erro ao buscar mais infos: ${error}`);

        })

    }

    function tooglePostModal(item) {
        //console.log('COMPLEMENTO', item.complemento)
        setShowPostModal(!showPostModal); //abre e fecha a janela do modal
        setDetail(item);

    }



    if (loading) {
        return (
            <div>
                <Header />

                <div className='content'>

                    <Title name="Admin Clientes">
                        <FiDatabase size={25} />
                    </Title>

                    <div className="dashboard">
                        <span><FaSearchPlus /> Buscando clientes...</span>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />

            <div className='content'>

                <Title name="Admin Clientes">
                    <FiDatabase size={25} />
                </Title>

                {clientes.length === 0 ? (
                    <div className="container dashboard">
                        <span>Nenhum cliente registrado...</span>
                        <Link to="/customers" className="novo"><FiPlus size={25} color="#FFF" /> Novo Cliente</Link>
                    </div>
                ) : (<>
                    <Link to="/customers" className="novo"><FiPlus size={25} color="#FFF" /> Novo Cliente</Link>
                    {clientes.length !== 0 ? (

                        clientes.map((item, index) => {
                            return (
                                <table>
                                    {index === 0 ? (
                                        <thead>
                                            <tr key={index}>
                                                <th scope='col'>Cliente</th>
                                                <th scope='col'>CNPJ</th>
                                                <th scope='col'>Endereco</th>
                                                <th scope='col'>#</th>
                                            </tr>
                                        </thead>
                                    ) : (<></>)
                                    }
                                    <tbody>
                                        <tr key={item.id}>
                                            <td data-label="Cliente">{item.nomeFantasia}</td>
                                            <td data-label="CNPJ">{item.cnpj}</td>
                                            <td data-label="Endereco">{item.endereco}</td>
                                            <td data-label="#">
                                                <button className="action" style={{ backgroundColor: '#3586f3' }} onClick={() => tooglePostModal(item)}>
                                                    <FiSearch color="#FFF" size={17} />
                                                </button>
                                                <Link className="action" style={{ backgroundColor: '#F6A935' }} to={`/editclient/${item.id}`}>
                                                    <FiEdit2 color="#FFF" size={17} />
                                                </Link>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            );
                        })
                    ) : (<></>)
                    }
                </>)
                }
                {loadingMore && <h3 style={{ textAling: 'center', marginTop: 15 }}>buscando dados...</h3>}
                {!loading && !isEmpty && <button className="btn-more" onClick={handleMore}><FaSearchPlus />Buscar mais</button>}
            </div>
            {showPostModal && (
                <ModalClients
                    conteudo={detail}
                    close={tooglePostModal}
                />
            )}
        </div>
    );

}
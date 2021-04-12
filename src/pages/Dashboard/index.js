import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Title from '../../components/Title';
import Modal from '../../components/Modal';

//conversores formatadores de datas
import { format } from 'date-fns';
//icons
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { FaSearchPlus } from 'react-icons/fa';

//link do react-router-dom
import { Link } from 'react-router-dom';

//conexao banco
import firebase from '../../services/firebaseConnection';

import { toast } from 'react-toastify';

import './dashboard.css';

export default function Dashboard() {
    //const { signOut } = useContext(AuthContext);

    const [chamados, setChamados] = useState([]);
    const [colorBadge, setColorBadge] = useState('#FFF');
    const [loading, setLoading] = useState(true);
    const [loadingmore, setLoadingMore] = useState(false);
    const [lastDocs, setLastDocs] = useState();
    const [isEmpty, setIsEmpty] = useState(false);

    const [showPostModal, setShowPostModal]= useState(false);
    const [detail, setDetail] = useState();

    const listaRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

    const { user } = useContext(AuthContext);

    useEffect(() => {

        loadChamados();

        return () => {

        }

    },
        []);

    async function loadChamados() {


        await listaRef.limit(5)
            .get()
            .then((snapshot) => {

                updateState(snapshot);

                
            })
            .catch((error) => {
                toast.error(`Erro ao buscar os chamados ${error}`);
                setLoading(false);
                setLoadingMore(false);
            })
        }

    function updateState(snapshot){
                    const isCollection = snapshot.size === 0;

                    if (!isCollection) {
                        let lista = [];
                        snapshot.forEach((doc) => {
                            lista.push({
                                id: doc.id,
                                nomeFantasia: doc.data().cliente,
                                assunto: doc.data().assunto,
                                status: doc.data().status,
                                data: doc.data().created,
                                dataFormatada: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                                userId: doc.data().userId,
                                clienteId: doc.data().clienteID,
                                complemento: doc.data().complemento
                                
                            })
                        })

                        const lastDoc = snapshot.docs[snapshot.docs.length -1]; //Pegando o ultimo documento buscado

                        setChamados(chamados => [...chamados, ...lista]);
                        setLastDocs(lastDoc);
                    } else {
                        setIsEmpty(true);
                    }

                    setLoadingMore(false);


                
            
        setLoading(false);
    }

    async function handleMore(){
        setLoadingMore(true);
        await listaRef.startAfter(lastDocs).limit(5)
        .get()
        .then((snapshot)=>{
          updateState(snapshot)
        })
      }
    
      function tooglePostModal(item){
          console.log('COMPLEMENTO', item.complemento)
          setShowPostModal(!showPostModal); //abre e fecha a janela do modal
          setDetail(item);
          
      }
    


    if (loading) {
        return (
            <div>
                <Header />
                <div className="content">

                    <Title name="Chamados" >
                        <FiMessageSquare size={25} />
                    </Title>
                    <div className="container dashboard">
                        <span><FaSearchPlus /> Buscando chamados...</span>

                    </div>
                </div>
            </div>

        )
    }


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
                        {chamados.length !== 0 ? (

                            chamados.map((item, index) => {

                                return (
                                    <table>
                                        {index === 0 ? (
                                            <thead>
                                                <tr key={index}>
                                                    <th scope='col'>Cliente</th>
                                                    <th scope='col'>Assunto</th>
                                                    <th scope='col'>Status</th>
                                                    <th scope='col'>Cadastrado em</th>
                                                    <th scope='col'>#</th>
                                                </tr>
                                            </thead>) : (<></>)
                                        }

                                        <tbody>
                                            <tr key={item.id}>
                                                <td data-label="Cliente">{item.nomeFantasia}</td>
                                                <td data-label="Assunto">{item.assunto}</td>
                                                <td data-label="Status">

                                                    <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>{item.status}</span>

                                                </td>
                                                <td data-label="Cadastrado">{item.dataFormatada}</td>
                                                <td data-label="#">
                                                    <button className="action" style={{ backgroundColor: '#3586f3' }} onClick={ () => {tooglePostModal(item)}}>
                                                        <FiSearch color="#FFF" size={17} />
                                                    </button>
                                                    <Link className="action" style={{ backgroundColor: '#F6A935' }} to={`/novo/${item.id}`}>
                                                        <FiEdit2 color="#FFF" size={17} />
                                                    </Link>
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>



                                )

                            },


                            )

                        ) : (
                            <></>
                        )}



                    </>

                    )
                }
                {loadingmore && <h3 style={{ textAling: 'center', marginTop: 15 }}>buscando dados...</h3>}
                {!loading && !isEmpty && <button className="btn-more" onClick={handleMore}><FaSearchPlus />Buscar mais</button>}


            </div>

                {showPostModal && (
                    <Modal
                        conteudo={detail}
                        close={tooglePostModal}
                     />
                )}

        </div>
    );
}
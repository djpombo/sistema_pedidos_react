import './editclient.css';
import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiDatabase } from 'react-icons/fi'

import { useState, useEffect, useContext } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import firebase from '../../services/firebaseConnection';

import { toast } from 'react-toastify';



export default function EditClient() {

    const { id } = useParams();
    const history = useHistory();

    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(0);

    const [idCostumer, setIdCostumer] = useState(false);//controla se quer editar o cliente

    const [cliente, setCliente] = useState();
    const [cnpj, setCnpj] = useState();
    const [endereco, setEndereco] = useState();

    async function handleRegister() {

    }

    //faz a busca no banco preenchendo um array com clientes selecionados
    useEffect(() => {
        async function loadCustomers() {
            await firebase.firestore().collection('customers')
                .get()
                .then((snapshot) => {

                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            nomeFantasia: doc.data().nomeFantasia
                        })
                    })

                    if (lista.length === 0) {
                        setLoadCustomers(false);
                        setCustomers([{ id: "1", nomeFantasia: 'FREELA' }]);
                        toast.info('Opa, infelizmente não encontramos nenhuma empresa no cadastro!');

                        return false;
                    }
                    else {

                        setLoadCustomers(false);
                        setCustomers(lista);

                        //teste pra ver se quer editar ao invés de um novo chamado
                        if (id) {
                            loadId(lista);
                        }
                    }
                })
                .catch((error) => {
                    setLoadCustomers(false);
                    toast.error(`Opa! aconteceu o seguinte problema: ${error}`);
                    setCustomers([{ id: "1", nomeFantasia: '' }]);//pra se nao carregar nada ficar vazio o select
                })
        }
        loadCustomers();
    },
        [id]);


    async function loadId(lista) {

        await firebase.firestore().collection('chamados').doc(id)
            .get()
            .then((snapshot) => {
                //setAssunto(snapshot.data().assunto);
                //setStatus(snapshot.data().status);
                //setComplemento(snapshot.data().complemento);

                let index = lista.findIndex(item => item.id === snapshot.data().clienteID);

                setCustomerSelected(index);

                setIdCostumer(true);

            })
            .catch((error) => {
                toast.error('Erro ao tentar conectar a base de dados');
                setIdCostumer(false);
            })
    }

    return (
        <div>
            <Header />
            <div classname="content" >
                <Title name="Editar Cliente">
                    <FiDatabase size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>

                    </form>
                </div>
            </div>
        </div>
    );
}
import { useState, useEffect, useContext } from 'react';

import firebase from '../../services/firebaseConnection';

import { useHistory, useParams } from 'react-router-dom';


import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiPlusCircle } from 'react-icons/fi'

import { toast } from 'react-toastify';

import './novo.css';



export default function Novo() {

    const { id } = useParams();
    const history = useHistory();

    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(0);

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [Complemento, setComplemento] = useState('');

    const [idCostumer, setIdCostumer] = useState(false);//controla se quer editar o chamado

    const { user } = useContext(AuthContext);

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
        [id])


    async function handleRegister(e) {

        if(idCostumer){
            await firebase.firestore().collection('chamados').doc(id)
            .update({
                cliente: customers[customerSelected].nomeFantasia,
                clienteID: customers[customerSelected].id,
                assunto: assunto,
                status: status,
                complemento: Complemento,
                userId: user.uid
            })
            .then(()=>{
                toast.success('Chamado alterado com sucesso');
                setCustomerSelected(0);
                setComplemento('');
                //history.push('/dashboard');
                
                
            })
            .catch((error)=>{
                toast.error(`Erro ${error} ao atualizar chamado`)
            })

            return;//travar o fluxo
        }

        e.preventDefault();

        await firebase.firestore().collection('chamados')
            .add({
                created: new Date(),
                cliente: customers[customerSelected].nomeFantasia,
                clienteID: customers[customerSelected].id,
                assunto: assunto,
                status: status,
                complemento: Complemento,
                userId: user.uid //pegar o user que registrou o chamado
            })
            .then(() => {
                toast.info(`Registro de ${customers[customerSelected].nomeFantasia} efetuado com sucesso!`);
                setAssunto('');
                setCustomers([0]);
                setComplemento('');
                //history.push('/dashboard');
            })
            .catch((error) => {
                toast.error('Ops! Error ao salvar chamado no banco');
            })
    }

    function handleChangeSelect(e) {
        setAssunto(e.target.value);

    }

    function handleStatus(e) {
        setStatus(e.target.value);

    }

    //chamado quando troca de cliente no select
    function handleChangeCustomers(e) {
        setCustomerSelected(e.target.value);
    }

    async function loadId(lista) {

        await firebase.firestore().collection('chamados').doc(id)
            .get()
            .then((snapshot) => {
                setAssunto(snapshot.data().assunto);
                setStatus(snapshot.data().status);
                setComplemento(snapshot.data().complemento);

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

            <div className="content">

                <Title name="Novo Chamado">
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">

                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Cliente: </label>

                        {loadCustomers ? (
                            <input type="text" disabled={true} value="carregando clientes..." />) : (
                            <select value={customerSelected} onChange={handleChangeCustomers} >
                                {customers.map((item, index) => {
                                    return (
                                        <option key={item.id} value={index} >
                                            {item.nomeFantasia}
                                        </option>
                                    )
                                })}
                            </select>
                        )}




                        <label>Assunto: </label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita_tecnica">Visita Tecnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className="status" >
                            <input
                                type="radio"
                                name="radio"
                                value="Aberto"
                                onChange={handleStatus}
                                checked={status === "Aberto"}
                            />
                            <span>Em Aberto</span>

                            <input
                                type="radio"
                                name="radio"
                                value="Progresso"
                                onChange={handleStatus}
                                checked={status === "Progresso"}
                            />
                            <span>Em Progresso</span>

                            <input
                                type="radio"
                                name="radio"
                                value="Atendido"
                                onChange={handleStatus}
                                checked={status === "Atendido"}
                            />
                            <span>Atendido</span>
                        </div>
                        <label>Complemento:</label>
                        <textarea
                            type="text"
                            placeholder="descreva seu problema (opcional)"
                            value={Complemento}
                            onChange={(e) => { setComplemento(e.target.value) }}

                        />

                        <button type="submit">Registrar</button>

                    </form>


                </div>

            </div>

        </div>
    );
}
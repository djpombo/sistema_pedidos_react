import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
//icones
import { FiLogOut, FiUsers } from 'react-icons/fi';
//components
import Header from '../../components/Header';
import Title from '../../components/Title';

//conexao com banco
import firebase from '../../services/firebaseConnection';

//alerts
import { toast } from 'react-toastify';




import './customers.css';
//import '../Profile/profile.css';

export default function Customers() {

    const { user, signOut, setUser } = useContext(AuthContext);

    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');


    async function handleAdd(e) {
        e.preventDefault();
        if (nomeFantasia !== '' && cnpj !== '' && endereco !== '') {
            await firebase.firestore().collection('customers')
                .add({
                    nomeFantasia: nomeFantasia,
                    cnpj: cnpj,
                    endereco: endereco
                }).then(()=>{
                    toast.info(`Registro de ${nomeFantasia} efetuado com sucesso!`);
                    setNomeFantasia('');
                    setCnpj('');
                    setEndereco('');
                    
                }).catch((error) =>{
                    toast.error(`Ocorreu o seguinte problema: ${error}`);
                })



        }//fim do if
        else{
            toast.error("Ops! Por favor preencha todos os campos!");
        }
        //
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title name='Clientes'><FiUsers size={25} /></Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleAdd}>
                        <label>Nome Fantasia</label>
                        <input type="text" placeholder="Nome da empresa" autoFocus
                            value={nomeFantasia} onChange={(e) => { setNomeFantasia(e.target.value) }} />

                        <label>CNPJ</label>
                        <input type="text" placeholder="Cnpj do cliente"
                            value={cnpj} onChange={(e) => { setCnpj(e.target.value) }} />

                        <label>Endereço</label>
                        <input type="text" placeholder="Rua x, n 5"
                            value={endereco} onChange={(e) => { setEndereco(e.target.value) }} />

                        <button type="submit">Cadastrar</button>

                    </form>
                </div>
            </div>
            <div>
                <button onClick={signOut}>Sair</button>
            </div>
        </div>
    );
}
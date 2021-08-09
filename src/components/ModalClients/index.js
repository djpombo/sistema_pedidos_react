import '../Modal/modal.css';

import { FiX } from 'react-icons/fi'


export default function ModalClients({conteudo, close}){
    return(
        <div className="modal">
            <div className="container">
                <button className="close" onClick={ close }>
                    <FiX size={23} color="#FFF"/>
                    Voltar
                </button>
                <div>
                    <h2>Detalhes do cliente:</h2>

                    <div className="row">
                        <span>
                            Cliente: <i>{ conteudo.nomeFantasia }</i>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            Cnpj: <i>{ conteudo.cnpj }</i>
                        </span>
                        <span>
                            Endereço: <i>{ conteudo.endereco }</i>
                        </span>
                    </div>

                                       

                </div>
            </div>
        </div>
    );
}
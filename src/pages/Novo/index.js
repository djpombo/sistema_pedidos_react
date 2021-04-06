import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiMessageSquare } from 'react-icons/fi'


export default function Novo(){
    return(
        <div>
            <Header />
        
        <div className="content">
            
            <Title name="Novo Chamado">
            <FiMessageSquare size={25}/>
            </Title>
            <div className="container">
                
            </div>
            
        </div>
        </div>
    );
}
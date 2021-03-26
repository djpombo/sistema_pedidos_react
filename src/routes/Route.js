import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';


export default function RouteWrapper({
    component: Component,
    isPrivate,
    ...rest
}){

        const {signed, loading} = useContext(AuthContext);

        
    

    if (loading){
        return (
            <div>

            </div>
        );
    }
    /**
     * Usuario não esta logado querendo acessar um rota privada é redirecionado para o login
     */
    if(!signed && isPrivate){
        return <Redirect to="/"/>
    }
    /**
     * Usuario logado, querendo por exemplo acessar a tela de login novamente
     */
    if(signed && !isPrivate){
        return <Redirect to="/dashboard" />
    }
    return(
        <Route 
            {...rest}
            render={props =>(
                <Component {...props}/>
            )}
        />
    );
}
    

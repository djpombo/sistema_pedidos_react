import { Switch } from 'react-router-dom';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Customers from '../pages/Customers';
import ClientsEdit from '../pages/ClientsEdit';
import Novo from '../pages/Novo';
import EditClient from '../pages/EditClient';


import Route from './Route';


export default function Routes(){

    return(
        <Switch>
            <Route exact path="/" component={SignIn}/>
            <Route exact path="/register" component={SignUp} />
            <Route exact path ="/dashboard" component={Dashboard} isPrivate/>
            <Route exact path ="/profile" component={Profile} isPrivate/>
            <Route exact path = '/customers' component={Customers} isPrivate/>
            <Route exact path = '/novo' component={Novo} isPrivate />
            <Route exact path='/novo/:id' component={Novo} isPrivate />
            <Route exact path='/clientsedit' component={ClientsEdit} isPrivate />
            <Route exact path='/editclient/:id' component={EditClient} isPrivate />
            
        </Switch>
    );
}
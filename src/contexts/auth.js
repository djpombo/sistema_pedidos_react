import { useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';


export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        function loadStorage() {

            //vai buscar no item se tem alguem e se tive coloca ele como objeto no storageUser
            const storageUser = localStorage.getItem('SistemaUser');

            //se tiver um storageUser, converte ele de object para JSON novamente
            if (storageUser) {

                setUser(JSON.parse(storageUser));
                setLoading(false);
            }

            setLoading(false);
        }
        loadStorage();

    }, []);


    async function signUp(email, password, nome) {
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;
                await firebase.firestore().collection('users').doc(uid).set({
                    nome: nome,
                    avatarUrl: null,

                })
                    .then(() => {
                        let data = {
                            uid: uid,
                            nome: nome,
                            email: value.user.email,
                            avatarUrl: null

                        };
                        setUser(data);
                        storageUser(data);
                        setLoadingAuth(false);

                    })
            }).catch((error) => {
                console.log(error);
                setLoadingAuth(false);
            })
    }

    function storageUser(data) {
        localStorage.setItem('SistemaUser', JSON.stringify(data));
    }

    async function signOut(){

        await firebase.auth().signOut();
        localStorage.removeItem('SistemaUser');
        setUser(null);
    }

    return (
        /**
         * !!user verifica se está diferente de null entao é true, senao false
         * indica se o usuario está logado
         */
        <AuthContext.Provider value={
            {
                signed: !!user,
                user,
                loading,
                signUp,
                signOut
            }}>
            { children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;


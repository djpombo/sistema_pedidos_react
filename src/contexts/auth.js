import 'react-toastify/dist/ReactToastify.css';
import { useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';

import { toast, ToastContainer } from 'react-toastify';


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

    async function signIn(email, password) {
        setLoadingAuth(true);
        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(async (value) => {

                let uid = value.user.uid;
                /**
                 * tendo em maos o uid que retornou no value, enviamos para recuperar o restante das
                 * informações do usuario que estão no banco dentro da tabela users mandando o id
                 * único como doc e recebendo e recuperando via get();
                 */
                const userProfile = await firebase.firestore().collection('users').doc(uid).get();
                /**
                 * Monta o objeto data recuperando o uid que ja esta em variavel, buscando tb
                 * o nome que veio de resposta do firestore e armazenado no userProfile, bem como
                 * o avatar, o email não está no firestore e sim no auth, entao recuperamos ele do
                 * campo de reesposta do signInWithEmailAndPassword
                 */
                let data = {
                    uid: uid,
                    nome: userProfile.data().nome,
                    email: value.user.email,
                    avatarUrl: userProfile.data().avatarUrl
                }
                /**
                 * montado o objeto data, usa o context_API para setar para toda a aplicação
                 * o ususario dizendo tb que está logado redirecionando para a dash,
                 * tb localmente no navegador o storage e derruba o loading
                 */
                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success(`Bem vindo de volta! ${data.nome}`)

            }).catch((error) => {
                console.log('error: ' + error);
                toast.error("Ops, algo deu errado =(");
                setLoadingAuth(false);

            });
    }

    /** Cadastrar um novo Usuario na plataforma */
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
                        toast.success(`Bem vindo a Plataforma!\n${data.nome}`);

                    })
            }).catch((error) => {
                console.log(error);
                toast.error('Ops, algo está errado!');
                setLoadingAuth(false);
                
            })
    }

    function storageUser(data) {
        localStorage.setItem('SistemaUser', JSON.stringify(data));
    }

    /** Fazer logout do usuario */
    async function signOut() {

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
                signOut,
                signIn,
                loadingAuth,
                setUser,
                storageUser
            }}>
            { children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;


import { useState, useContext } from 'react';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';

import { FiLogOut, FiSettings, FiShare } from 'react-icons/fi';

import { toast } from 'react-toastify';

import avatar from '../../assets/avatar.png';

export default function Profile() {
    const { user, signOut, setUser, storageUser } = useContext(AuthContext);

    /**
     * se tem um user, entao já deixa ele preenchido no campo
     */
    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);

    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);

    async function handleUpload(){
        const currentUID = user.uid;
        const uploadTask = await firebase.storage()
                        .ref(`images/${currentUID}/${imageAvatar.name}`)
                        .put(imageAvatar)
                        .then(async ()=>{
                            console.log('FOTO ENVIADA COM SUCESSO!')
                            await firebase.storage().ref(`images/${currentUID}`)
                            .child(imageAvatar.name).getDownloadURL()
                            .then(async (url) => {
                                let urlFoto = url
                                await firebase.firestore().collection('users')
                                        .doc(user.uid)
                                        .update({
                                            avatarUrl: urlFoto,
                                            nome: nome
                                        }).then(() =>{
                                            let data = {
                                                ...user,
                                                avatarUrl: urlFoto,
                                                nome: nome
                                            }
                                            toast.success('Perfil atualizado com sucesso!');
                                            
                                            setUser(data);
                                            storageUser(data);//para atualizar o localStorage tb
                                        })
                            })
                        })

    }

    function handleFile(e){
       
        if(e.target.files[0]){
            const image = e.target.files[0];
            
            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]));
            }else{
                alert('envie uma imagem do tipo PNG ou JPEG');
                setImageAvatar(null);
                return null;
            }
        }
    }

    async function handleSave(e){
        console.log('Nome: '+nome);
        e.preventDefault();

        //se o ususario mudar somente o nome e nao a imagem
        if(imageAvatar === null && nome !== ''){
            
            /** busca no banco, na coleção de users o uid do usuario qu vai ser
             * alterado, montando um novo objeto e passa o nome recuperado via context
             */
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                nome: nome
            })
            .then(()=>{
                let data ={
                    ...user,
                    nome: nome
                };
                toast.success('Perfil atualizado com sucesso!');
                setUser(data);
                storageUser(data);
            })
            .catch((error)=>{
                //alert(error);
                toast.error('Ops! algo deu errado' + error);
            })
            
        }
        else if(imageAvatar !== null && nome !== ''){
            handleUpload();
        }
        
    }

    
    return (
        <div>
            <Header />
            <div className="content">
                <Title name="Meu perfil" >
                    <FiSettings size={25} />
                </Title>
                <div className="container">
                    <form className="form-profile" onSubmit={handleSave}>
                        <label className="label-avatar">
                            <span>
                                <FiShare color="#FFFF" size={25} />
                            </span>

                            <input type="file" accept="image/*" onChange={handleFile}/><br />
                            {avatarUrl === null ?
                                <img src={avatar} width="250" height="250" alt="foto de perfil do usuario" /> :
                                <img src={avatarUrl} width="250" height="250" alt="foto de perfil do usuario" />}

                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => { setNome(e.target.value) }} />
                        <label>Email</label>
                        <input type="text" value={email} disabled={true} />

                        <button type="submit">Salvar</button>

                    </form>

                </div>
                <div className="container">
                <button className="logout-btn" onClick={()=>{ signOut() }}>Sair</button>
                </div>
            </div>
        </div>
    )
}
import './styles.css';
import logoCadastro from  '../../assets/cadastro1.png'
import { Link,useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {FiEdit, FiUserX} from 'react-icons/fi';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { FiXCircle } from 'react-icons/fi';
export default function Alunos() {
    
    const [searchInput,setSearchInput] = useState('');
    const [filtro,setfiltro] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    const history = useHistory();

    const authorization = {
        headers: {
            Authorization : `Bearer ${token}`   
        }
    }

    const searchAlunos = (searchValue)=>{
        setSearchInput(searchValue)
        if(searchInput !== ''){
            const dadosFiltrados = alunos.filter((item)=>{
                return  Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
            });
            setfiltro(dadosFiltrados);
        }else{
            setfiltro(alunos);
        }
    }

    useEffect(()=>{
        api.get('api/alunos',authorization).then(
            response=>{
                setAlunos(response.data);
                authorization.headers = '';
                history.push('/')
            },token)
    })

    async function logout(){
        try {
            localStorage.clear();
            localStorage.setItem('token','')
        } catch (error) {
            
        }
    }

    async function EditAluno(id){
        try{
          history.push(`aluno/novo/${id}`);
        }catch(error){
         alert('Não foi possível editar o aluno')
        }
      }

      async function deleteAluno(id){
        try {
            if(window.confirm('deseja deletar o aluno de id = ' + id + '?')){
                await api.delete(`api/alunos/${id}`,authorization);
                setAlunos(alunos.filter(aluno => aluno.id !==id));
            }
        } catch (error) {
            alert("Nao foi possive excluir " + error);
        }
      }

    return (
        <div className="aluno-container">
            <header><img src={logoCadastro} alt="LogoCadastro"></img>
            <span>Bem vindo, <strong>{email}</strong> </span>
            <Link className="button" to="aluno/novo/0">Novo Aluno</Link>

            <button onClick={logout} type="button">      
                <FiXCircle size={35} color="#17202a"/>
            </button>
            </header>
            <form> 
                <input type="text" placeholder="Nome" onChange={(e)=>searchAlunos(e.target.value)}></input>
            </form>
            <h1>Relacao de Alunos</h1>
            {searchAlunos.length > 1 ? (
            <ul>
               {filtro.map(aluno=>(
                 <li key={aluno.id}>
                  <b>Nome:</b>{aluno.nome}<br/><br/>
                  <b>Email:</b>{aluno.email}<br/><br/>
                  <b>Idade:</b>{aluno.idade}<br/><br/>

                 <button onClick={()=> EditAluno(aluno.id)} type="button">
                     <FiEdit size="25" color="#17202a" />
                 </button>

                 <button type="button" onClick={()=>deleteAluno(aluno.id)}> 
                         <FiUserX size="25" color="#17202a" />
                   </button>
               </li>
                ))}
            </ul>
            ):(
                <ul>
               {alunos.map(aluno=>(
                 <li key={aluno.id}>
                  <b>Nome:</b>{aluno.nome}<br/><br/>
                  <b>Email:</b>{aluno.email}<br/><br/>
                  <b>Idade:</b>{aluno.idade}<br/><br/>

                 <button onClick={()=> EditAluno(aluno.id)} type="button">
                     <FiEdit size="25" color="#17202a" />
                 </button>

                 <button type="button" onClick={()=>deleteAluno(aluno.id)}> 
                         <FiUserX size="25" color="#17202a" />
                   </button>
               </li>
                ))}
            </ul>
            )}
        </div>
    )   
}
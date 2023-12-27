import React,{useEffect, useState} from "react";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";
import './styles.css';
import {useHistory} from 'react-router-dom';
import {FiCornerDownLeft, FiUserPlus } from 'react-icons/fi';
import api from '../../services/api';


export default function NovoAluno()
{

    const [id,setId] = useState(null);
    const [nome,setNome] = useState('');
    const [email,setEmail] = useState('');
    const [idade,setIdade] = useState(0);
    
    const {alunoId} = useParams(); 
    const history = useHistory();
    const token = localStorage.getItem('token');

    const authorization = {
        headers: {
            Authorization : `Bearer ${token}`   
        }
    }

    useEffect(()=>{
        if(alunoId === '0')
            return;
        else
            loadAluno();
    }, alunoId)


    async function loadAluno(){
        try {
          
            const response = api.get(`api/alunos/${alunoId}`,authorization); 

            setId(response.data.Id);
            setNome(response.data.nome);
            setEmail(response.data.email);
            setIdade(response.data.idade);

        } catch (error) {
            alert("Erro ao crregar o aluno" + error) 
            history.push('/alunos')
        }
    }


    async function saveOrUpdate(event)
    {
        event.preventDefault();
        const data = {
            nome,
            email,
            idade
        }

        try {
            if(alunoId === '0'){
                await api.post('api/alunos',data, authorization);
            }
            else
            {
                data.id = id;
                await api.put(`api/alunos/${id}`,data,authorization);
            }
            
        } catch (error) {
            alert('Erro ao gravar o aluno' + error);
        }
        history.push('/alunos')
    }

    

    return (
        <div className="novo-aluno-container">
            <div className="content">
                    <section className="form">
                        <FiUserPlus size="105" color="#17202a"></FiUserPlus>
                        <h1>{ alunoId === '0' ? 'Incluir novo Aluno' : 'Atualizar aluno'}</h1>
                        <h1>Retornar</h1>
                        <Link className="back-link" to="/alunos">
                            <FiCornerDownLeft size="25" color="#17202a">Retornar</FiCornerDownLeft>
                        </Link>
                    </section>
                    <form onSubmit={saveOrUpdate}>
                        <input placeholder="ID" value={id} onChange={e=>setId(e.target.value)} ></input>
                        
                        <input placeholder="Nome" value={nome} onChange={e=>setNome(e.target.value)} ></input>
                        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}></input>
                        <input placeholder="Idade" value={idade} onChange={e=>setIdade(e.target.value)} ></input>
                        <button className="button" type="submit">{alunoId === '0' ? 'Incluir':'Atualizar'}</button>
                    </form>
            </div>
        </div>
    );
}
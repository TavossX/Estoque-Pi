import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../Responsive.css';
import iconWave from '../../assets/icon-wave.png';
import Notiflix from 'notiflix';
import { FaBox } from "react-icons/fa";
import { BiSolidCategory , BiLogOut } from "react-icons/bi";

const Sidebar = () => {
    const navigate = useNavigate();

    // Verifica se o usuário está autenticado
    useEffect(() => {
        // Pega o nome, caso não tenha volta pra página inicial
        let username = localStorage.getItem('username');
        if(username === '' || username === null){
            navigate('/');
        }
    }, [navigate]);

    // Função pra desligar, removendo token e username
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.reload();
        navigate('/');
        Notiflix.Notify.success('Você saiu com sucesso!');
    };
    
    

  return (
    <div className="sidebar fixed w-[50px] h-full bg-white rounded-lg shadow-lg ">
            <div className="c-side flex flex-col items-center h-full">
                <div className="c-icons flex flex-col justify-between h-full items-center py-4">
                    <div>
                        <img src={iconWave} className="img-wave w-8" alt="Logo Wave Abstract" />
                    </div>
                    <div className="lists gap-5 flex flex-col">
                        <div>
                            <Link to="/main" className="list-prod flex justify-center items-center">
                                <FaBox className='hover:text-blue-900 w-[25px] h-[25px]' />
                            </Link>
                        </div>
                        <div>
                            <Link to="/category" className="categoria flex justify-center items-center">
                                <BiSolidCategory  className='hover:text-blue-900 w-[30px] h-[30px]' />
                            </Link>
                        </div>
                    </div>
                    <div>
                        <Link onClick={handleLogout} className="flex justify-center items-center">
                            <BiLogOut className='hover:text-blue-900 w-[30px] h-[30px]' />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default Sidebar;
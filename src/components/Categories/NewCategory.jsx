import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Notiflix from 'notiflix';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import { IoArrowBack } from "react-icons/io5";
import { BiSave } from "react-icons/bi";

const NewCategory = () => {
    // Armazenando o nome da categoria
    const[name, setName] = useState("");

    const navigate = useNavigate();

    // Parte da nova categoria
    const handleSubmit=(e)=>{
        e.preventDefault();
        const token = localStorage.getItem('token');
        fetch("https://challenge-labi9-4b4c472d5c07.herokuapp.com/api/categories", {
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body:JSON.stringify({name})
        }).then(res => res.json())
        .then(() => {
            Notiflix.Notify.success("Nova categoria cadastrada!")
            navigate('/category');
        })
        .catch((error) => {
            Notiflix.Notify.failure("Error:", error.message);
        });
    };

    return (
        <div>
            <Sidebar/>
            <Header/>
            <div className="c-products flex pl-20 pr-8 h-[90vh] items-center justify-center">
                <form onSubmit={handleSubmit} className="w-[600px]">
                    <div className="flex bg-white p-4 rounded-xl overflow-auto items-center justify-between shadow-md">
                        <h1 className="font-bold text-[23px] mr-4">
                            Cadastrar Categoria
                        </h1>
                        <div className="flex gap-3 items-center">
                            <button type="submit">
                                <BiSave className='hover:text-blue-900 w-[37px] h-[37px]'/>
                            </button>
                            <Link to="/category">
                                <IoArrowBack className='hover:text-blue-900 w-[35px] h-[35px]'/>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl flex justify-center items-center my-5 shadow-md">
                        <div className="w-[100%] p-5 flex flex-col">
                            <div className="mb-4">
                                <label className="text-[18px] font-semibold mb-2 block">
                                    Nova Categoria
                                </label>
                                <input required value={name} className="input-edit w-full border border-gray-400 px-4 py-2 rounded-md" onChange={(e) => setName(e.target.value)} placeholder="Digite o nome da categoria"/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewCategory;

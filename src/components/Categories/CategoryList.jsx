import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Notiflix from 'notiflix';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import { CgFileAdd } from "react-icons/cg";

const CategoryList = () => {
    // Armazenando a lista da categoria
    const [category, setCategory] = useState(null);

    // Parte da Lista de categorias
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('https://challenge-labi9-4b4c472d5c07.herokuapp.com/api/categories', {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            }            
        })
        .then((res) => res.json())
        .then((resp) => {
            setCategory(resp.data);
        })
        .catch((error) => {
            Notiflix.Notify.failure(error.message);
        });
    }, []);

    return (
        <>
            <Sidebar />
            <Header/>
            <div className="c-products flex pl-20 pr-8 h-[90vh] items-center justify-center">
            <div className="w-[600px]">
                <div className="flex bg-white p-4 rounded-xl overflow-auto items-center justify-between shadow-md">
                    <h1 className="font-bold text-[23px] mr-4">
                        Lista de Categorias
                    </h1>
                    <Link to="/category/create">
                        <CgFileAdd className="hover:text-blue-900 w-[40px] h-[40px]" /> 
                    </Link>
                </div>
                <div className="core my-5 overflow-auto h-[400px]">
                    <div className="sticky top-0 font-semibold text-[18px] grid justify-items-center grid-center grid-cols-[20%,80%] justify-center h-[55px] bg-white items-center my-4 p-4 rounded-xl shadow-md">
                        <h3>ID</h3>
                        <h3>Categorias</h3>
                    </div>
                    {category && category.map(cat => (
                        <div className="grid justify-items-center grid-cols-[20%,80%] justify-center h-[55px] bg-white items-center my-4 p-4 rounded-xl shadow-md" key={cat.id}>
                            <div>
                                <h2>{cat.id}</h2>
                            </div>
                            <div>
                                <h2>{cat.name}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
};

export default CategoryList;

import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Notiflix from 'notiflix';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import { IoArrowBack } from "react-icons/io5";

const CategoryDetail = () => {
    // Pegando o ID da URL
    const {id} = useParams();

    // Armazenando os detalhes da categoria
    const [item, setItem] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`https://challenge-labi9-4b4c472d5c07.herokuapp.com/api/products/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        // Convertendo para JSON
        .then((res) => res.json())
        .then((resp) => {
            setItem(resp.data);
        })
        .catch((error) => {
            Notiflix.Notify.failure(error.message);
        });
    }, [id]);

    return (
        <div>
            <Sidebar />
            <Header />
            <div className="c-products flex pl-20 pr-10 h-[90vh] items-center justify-center">
                <div className='w-[600px]'>
                    <div className='flex bg-white p-4 rounded-xl overflow-auto items-center justify-between'>
                        <h1 className='name-list font-bold text-[23px] mr-4'>Detalhes</h1>
                        <div>
                            <Link to={"/main"}>
                                <IoArrowBack className='hover:text-blue-900 w-[35px] h-[35px]'/>
                            </Link>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl flex justify-center items-center my-5 shadow-md">
                        <div className="core w-[100%] p-5 flex flex-col justify-start cursor-default overflow-auto">
                            {item && (
                                <div>
                                    <div className="mb-4">
                                        <h3 className='n-label text-[18px] font-semibold mb-2 block '>ID</h3>
                                        <div className="w-full border border-gray-400 bg-gray-200 px-4 py-2 rounded-md">{item.id}</div>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className='n-label text-[18px] font-semibold mb-2 block'>Produto</h3>
                                        <div className="w-full border border-gray-400 bg-gray-200 px-4 py-2 rounded-md">{item.name}</div>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className='n-label text-[18px] font-semibold mb-2 block'>Descrição</h3>
                                        <div className="w-full border border-gray-400 bg-gray-200 px-4 py-2 overflow-auto h-[55px] rounded-md">{item.description}</div>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className='n-label text-[18px] font-semibold mb-2 block'>Categoria</h3>
                                        <div className="w-full border border-gray-400 bg-gray-200 px-4 py-2 rounded-md">{item.category.name}</div>
                                    </div>
                                    <div>
                                        <h3 className='n-label text-[18px] font-semibold mb-2 block'>Preço</h3>
                                        <div className="w-full border border-gray-400 bg-gray-200 px-4 py-2 rounded-md">R$ {item.price}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryDetail;

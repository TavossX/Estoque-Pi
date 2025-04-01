import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Notiflix from 'notiflix';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import { IoArrowBack } from "react-icons/io5";
import { BiSave } from "react-icons/bi";

const NewProducts = () => {

    const[name, setName] = useState("");
    const[price, setPrice] = useState(0);
    const[description, setDescription] = useState("");
    const[catId, setCatId] = useState("");
    const[categories, setCategories] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch("https://challenge-labi9-4b4c472d5c07.herokuapp.com/api/categories", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            }            
        })
        .then(res => res.json())
        .then(data => {
            setCategories(data.data);
        })
        .catch(error => {
            Notiflix.Notify.failure("Erro ao carregar categorias: " + error.message);
        });
    }, []);

    const handleSubmit=(e)=>{
        // e.repeventDefault faz não resetar
        e.preventDefault();
        const token = localStorage.getItem('token');
        fetch("https://challenge-labi9-4b4c472d5c07.herokuapp.com/api/products", {
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            // Produtos enviados
            body:JSON.stringify({name, price, description, category_id: catId})
        }).then(res => res.json())
        .then(() => {
            Notiflix.Notify.success("Novo Produto Cadastrado!")
            navigate('/main');
        })
        .catch((error) => {
            console.log(error)
            Notiflix.Notify.failure("Error:", error.message);
        });
    };

    return (
        <>
            <Sidebar/>
            <Header/>
            <div className="c-products flex pl-20 pr-8 h-[90vh] items-center justify-center">
                <form onSubmit={handleSubmit} className="m-edit w-[600px]">
                    <div className=" flex bg-white p-4 rounded-xl items-center justify-between shadow-md">
                        <h1 className=" font-bold text-[23px] mr-4">
                            Novo Produto
                        </h1>
                        <div className="flex gap-3 items-center">
                            <button type="submit" className="">
                                <BiSave className='hover:text-blue-900 w-[37px] h-[37px]'/> 
                            </button>
                            <Link to="/main">
                                <IoArrowBack className='hover:text-blue-900 w-[35px] h-[35px]'/>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white overflow-y-auto rounded-xl flex justify-center items-center my-5 shadow-md">
                        <div className="core w-[100%] p-5 flex flex-col overflow-auto">
                            <div className="mb-4">
                                <label className="text-[18px] font-semibold mb-2 block">
                                    Produto
                                </label>
                                <input required className="w-full border border-gray-400 px-4 py-2 rounded-md" value={name} onChange={(e) => setName(e.target.value)}  placeholder="Digite o nome do produto"/>
                            </div>

                            <div className="mb-4">
                                <label className="text-[18px] font-semibold mb-2 block">
                                    Descrição
                                </label>
                                <input required className="w-full border border-gray-400 px-4 py-2 rounded-md" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Digite a descrição"/>
                            </div>

                            <div className="label-edit mb-4">
                                <label className="text-[18px] font-semibold mb-2 block">
                                    Categoria
                                </label>
                                <select required className="w-full border border-gray-400 px-4 py-2 rounded-md" value={catId} onChange={(e) => setCatId(e.target.value)}>
                                    <option value="">Selecione uma Categoria</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="text-[18px] font-semibold mb-2 block">
                                    Preço
                                </label>
                                <input required type="number" className="input-edit w-full border border-gray-400 px-4 py-2 rounded-md" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Digite o preço"/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};


export default NewProducts;

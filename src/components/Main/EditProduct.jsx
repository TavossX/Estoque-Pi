import Notiflix from 'notiflix';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import { IoArrowBack } from "react-icons/io5";
import { BiSave } from "react-icons/bi";


const EditProduct = () => {
    // Pegando o ID do produto
    const {id} = useParams();

    // Armazenando os dados do produto
    const[editId, setEditId] = useState("");
    const[name, setName] = useState("");
    const[price, setPrice] = useState(0);
    const[description, setDescription] = useState("");
    const[catId, setCatId] = useState("");
    const[categories, setCategories] = useState([]);
    
    const navigate = useNavigate();    

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`https://challenge-labi9-4b4c472d5c07.herokuapp.com/api/products/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then((resp) => {
            // Verificando se os dados foram retornados
            if (resp && resp.data) {
                setEditId(resp.data.id);
                setName(resp.data.name);
                setPrice(resp.data.price);
                setDescription(resp.data.description);
                setCatId(resp.data.category_id);
            } else {
                Notiflix.Notify.failure("Produto não encontrado");
                navigate('/main');
            }
        })
        .catch((error) => {
            Notiflix.Notify.failure(error.message);
        });
    }, [id, navigate]);


    // useFect buscando as categorias disponíveis
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
            Notiflix.Notify.failure("Erro na categoria: " + error.message);
        });
    }, [id]);

    const handleSubmit=(e)=>{
        e.preventDefault();
        const token = localStorage.getItem('token');
        fetch(`https://challenge-labi9-4b4c472d5c07.herokuapp.com/api/products/${id}`, {
            method:"PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({editId, name, price, description, category_id: catId })
        }).then(res => res.json())
        .then(() => {
            Notiflix.Notify.success("Produto Editado!")
            navigate('/main');
        })
        .catch((error) => {
            console.log(error)
            Notiflix.Notify.failure("Error:", error.message);
        });
    };

    return (
        <div>
            <Sidebar/>
            <Header/>
            <div className="c-products flex px-20 h-[90vh] items-center justify-center">
            <form onSubmit={handleSubmit} className="w-[600px]">
                <div className="h-list flex bg-white p-4 rounded-xl overflow-auto items-center justify-between shadow-md">
                    <h1 className="font-bold text-[23px] mr-4">
                        Editar Produto
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

                <div className="bg-white rounded-xl flex justify-center items-center my-5 shadow-md">
                    <div className="core w-[100%] p-5 flex flex-col overflow-auto">
                        <div className="mb-4">
                            <label className="text-[18px] font-semibold mb-2 block">Produto</label>
                            <input required value={name} className="input-edit w-full border border-gray-400 px-4 py-2 rounded-md" onChange={(e) => setName(e.target.value)} placeholder="Digite o nome do produto"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-[18px] font-semibold mb-2 block">Descrição</label>
                            <input required value={description} className="w-full border border-gray-400 px-4 py-2 rounded-md" onChange={(e) => setDescription(e.target.value)} placeholder="Digite a descrição"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-[18px] font-semibold mb-2 block">Categoria</label>
                            <select required value={catId} className="w-full border border-gray-400 px-4 py-2 rounded-md" onChange={(e) => setCatId(e.target.value)}>
                                <option value="">Selecione uma Categoria</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="text-[18px] font-semibold mb-2 block">Preço</label>
                            <input required type="number" className="input-edit w-full border border-gray-400 px-4 py-2 rounded-md" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Digite o preço"/>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        </div>
    )
}

export default EditProduct;

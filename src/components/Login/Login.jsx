import { useEffect, useState } from 'react';
import Notiflix from 'notiflix';
import wave from '../../assets/wave abstract.svg';
import iconWave from '../../assets/icon-wave.png';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, UsernameUpdate] = useState('');
    const [password, PasswordUpdate] = useState('');

    const [name, NameUpdate] = useState('');
    const [email, EmailUpdate] = useState('');
    const [passRegister, PassRegisterUpdate] = useState('');
    const [passConfirm, PassConfirmUpdate] = useState('');

    const [isLogin, setIsLogin] = useState(true);

    const navigate = useNavigate();

    // Limpando os campos
    const tradeForm = () => {
        setIsLogin(!isLogin);
        UsernameUpdate('');
        PasswordUpdate('');
        NameUpdate('');
        EmailUpdate('');
        PassRegisterUpdate('');
        PassConfirmUpdate('');
    };

    useEffect(() => {
        localStorage.clear()
    }, []);

    // Parte do Login
    const ProceedLogin = (e) => {
        e.preventDefault();
        if(validateLogin()) {
            fetch('https://challenge-labi9-4b4c472d5c07.herokuapp.com/api/auth/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                    // Enviando email e senha como JSON
                    body: JSON.stringify({ email: username, password}),
                }).then((res) => res.json())
                    .then(data => {
                        if(!data.error){
                            Notiflix.Notify.success('Entrou com sucesso!');
                            localStorage.setItem('token', data.data.token);
                            return fetch('https://challenge-labi9-4b4c472d5c07.herokuapp.com/api/auth/me', {
                                method: 'GET',
                                headers: {
                                    'Authorization': `Bearer ${data.data.token}`,
                                },
                            });
                        } else {
                            Notiflix.Notify.failure('Erro ao logar.');
                        }
                    })
                    .then((res) => res.json())
                    .then(userData => {
                        if (userData.data && userData.data.name) {
                            // Guarda o nome do usuário
                            localStorage.setItem('username', userData.data.name);
                            navigate('/main');
                        } else {
                            Notiflix.Notify.failure('Erro ao obter dados do usuário.');
                        }
                    })
                    .catch(error => console.error('Erro ao logar:', error));
            }
        };

    // Parte do Registro
    const ProceedRegister = (e) => {
        e.preventDefault();
        if(validateRegister()) {
            fetch('https://challenge-labi9-4b4c472d5c07.herokuapp.com/api/auth/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name: name, 
                    email: email, 
                    password: passRegister, 
                    password_confirmation: passConfirm
                }),
            }).then((res) => res.json())
                .then(data => {
                    if(!data.error){
                        Notiflix.Notify.success('Usuário registrado com sucesso');
                        setIsLogin(!isLogin);
                    }})
                .catch(error => Notiflix.Notify.failure('Erro ao registrar:', error));
            }};

    // Valida os campos do login
    const validateLogin = () => {
        let result = true;
        if (username === '' || username === null) {
            result = false;
            Notiflix.Notify.warning('E-mail inválido');
        }
        if (password === '' || password === null) {
            result = false;
            Notiflix.Notify.warning('Senha inválida');
        }
        return result;
    };

    // Valida os de registro
    const validateRegister = () => {
        let result = true;
        if (name === '' || name === null) {
            result = false;
            Notiflix.Notify.warning('Usuário inválido');
        }
        if (email === '' || email === null) {
            result = false;
            Notiflix.Notify.warning('E-mail inválido');
        }
        if (passRegister === '' || passRegister === null) {
            result = false;
            Notiflix.Notify.warning('Senha inválido');
        }
        // Verifica se a confirmação da senha é válida
        if (passConfirm === '' || passConfirm === null || passRegister !== passConfirm) {
            result = false;
            Notiflix.Notify.warning('Senha não é coerente');
        }
        return result;
    };

    return (
        <div className="flex relative w-full h-screen items-center justify-center overflow-hidden">
            <img src={wave} className="absolute w-full h-full z-[-1] object-cover" alt="Wave Abstract" />
            <main className="flex w-[80%] h-[80%] overflow-hidden rounded-[20px]">
                <div className="left-login !border-10 !border-white w-[50%] p-[30px] text-white font-serif flex flex-col justify-between rounded-l-[20px]">
                    <h4>The wave flows   —————— </h4>
                    <div>
                        <h2 className='get-text text-[60px] mb-[10px]'>Get <br></br>Everything <br></br> You Want</h2>
                        <p className='p-left'>you pode get everthing you want if you work hard. <br></br> trust the process and stick to the plan</p>
                    </div>
                </div>

                <form onSubmit={isLogin ? ProceedLogin : ProceedRegister} className="right-login bg-white w-[50%] flex flex-col items-center justify-center">
                    {isLogin ? (
                        <div className='bg-white w-full h-full flex p-[10px] items-center flex-col justify-between'>
                            <div className="flex items-center text-[14px] gap-[6px]">
                                <img src={iconWave} className="w-[20px]" alt="Icon Wave" />
                                <h3 className='font-bold'>Abstract</h3>
                            </div>

                            <div className="card-login w-[55%] flex flex-col items-center">
                                <h1 className='text-center text-[32px] mb-[30px]'>Bem-vindo(a)</h1>
                                <div className="flex w-full flex-col items-start justify-center my-[0.5rem]">
                                    <label for="email" className='mb-[5px] after:content-["*"] after:ml-0.5 after:text-red-500'>E-mail </label>
                                    <input className='w-full border-none rounded-[7px] p-[15px] bg-[#e8f0fe] text-[0.8rem] shadow-[0px_3px_5px_#00000030] outline-none box-border hover:bg-gray-200 focus:ring-2 focus:ring-blue-900' value={username} onChange={e => UsernameUpdate(e.target.value)} type="text" name="email" placeholder="Entre com seu e-mail" />
                                </div>
                                <div className="flex w-full flex-col items-start justify-center my-[0.5rem]">
                                    <label for="password" className='mb-[5px] after:content-["*"] after:ml-0.5 after:text-red-500'>Senha</label>
                                    <input value={password} className='w-full border-none rounded-[7px] p-[15px] bg-[#e8f0fe] text-[0.8rem] shadow-[0px_3px_5px_#00000030] outline-none box-border hover:bg-gray-200 focus:ring-2 focus:ring-blue-900' onChange={e => PasswordUpdate(e.target.value)} type="password" name="password" placeholder="Entre com sua senha" />
                                </div>
                                <button type="submit" className="w-full py-[1rem] mt-[1.5rem] border-none rounded-[7px] outline-none font-extrabold cursor-pointer bg-black text-white shadow-[0px_3px_5px_#00000080] hover:bg-gray-900 active:bg-black focus:outline-none focus:ring-2 focus:ring-blue-900">LOGIN</button>
                            </div>
                            <p> Não tem conta? <span className="text-blue-900 hover:text-blue-400 font-semibold cursor-pointer" onClick={tradeForm}> Cadastre-se </span></p>
                        </div>
                    ) : (
                        <div className='bg-white w-full h-full flex p-[10px] items-center flex-col justify-between'>
                            <div className="flex items-center text-[14px] gap-[6px]">
                                <img src={iconWave} className="w-[20px]" alt="Icon Wave" />
                                <h3 className='font-bold'>Abstract</h3>
                            </div>
                            
                            <div className='card-register w-[55%] flex flex-col items-center'>
                                <h1 className='text-center text-[32px] mb-[30px]'>Cadastre-se</h1>
                                <div className="flex w-full flex-col items-start justify-center my-[0.5rem]">
                                    <label for="name" className='mb-[5px] after:content-["*"] after:ml-0.5 after:text-red-500'>Nome de usuário</label>
                                    <input value={name} className='w-full border-none rounded-[7px] p-[15px] bg-[#e8f0fe] text-[0.8rem] shadow-[0px_3px_5px_#00000030] outline-none box-border hover:bg-gray-200 focus:ring-2 focus:ring-blue-900' onChange={e => NameUpdate(e.target.value)} type="text" name="name" placeholder="Digite seu usuário" />
                                </div>
                                <div className="flex w-full flex-col items-start justify-center my-[0.5rem]">
                                    <label for="email" className='mb-[5px] after:content-["*"] after:ml-0.5 after:text-red-500'>E-mail</label>
                                    <input value={email} className='w-full border-none rounded-[7px] p-[15px] bg-[#e8f0fe] text-[0.8rem] shadow-[0px_3px_5px_#00000030] outline-none box-border hover:bg-gray-200 focus:ring-2 focus:ring-blue-900 invalid:text-pink-700' onChange={e => EmailUpdate(e.target.value)} type="email" name="email" placeholder="Digite seu e-mail" />
                                </div>
                                <div className="flex w-full flex-col items-start justify-center my-[0.5rem]">
                                    <label for="password" className='mb-[5px] after:content-["*"] after:ml-0.5 after:text-red-500'>Senha</label>
                                    <input value={passRegister} className='w-full border-none rounded-[7px] p-[15px] bg-[#e8f0fe] text-[0.8rem] shadow-[0px_3px_5px_#00000030] outline-none box-border hover:bg-gray-200 focus:ring-2 focus:ring-blue-900' onChange={e => PassRegisterUpdate(e.target.value)} type="password" name="passRegister" placeholder="Digite sua senha" />
                                </div>
                                <div className="flex w-full flex-col items-start justify-center my-[0.5rem]">
                                    <label for="passConfirm" className='mb-[5px] after:content-["*"] after:ml-0.5 after:text-red-500'>Confirmar</label>
                                    <input value={passConfirm} className='w-full border-none rounded-[7px] p-[15px] bg-[#e8f0fe] text-[0.8rem] shadow-[0px_3px_5px_#00000030] outline-none box-border hover:bg-gray-200 focus:ring-2 focus:ring-blue-900' onChange={e => PassConfirmUpdate(e.target.value)} type="password" name="passConfirm" placeholder="Confirme sua senha" />
                                </div>
                                <button type="submit" className="w-full py-[1rem] mt-[1.5rem] border-none rounded-[7px] outline-none font-extrabold cursor-pointer bg-black text-white shadow-[0px_3px_5px_#00000080] hover:bg-gray-900 active:bg-black focus:outline-none focus:ring-2 focus:ring-blue-900">CADASTRAR</button>  
                            </div>
                            <p> Já tem uma conta? <span className="text-blue-900 hover:text-blue-400 font-semibold cursor-pointer" onClick={tradeForm}> Faça login </span> </p>
                        </div>
                    )}
                </form>
            </main>
        </div>
    );
};

export default Login;

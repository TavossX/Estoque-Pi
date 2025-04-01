import iconAdm from '../../assets/adm.png';

const Header = () => {
    // Pega o nome do usuário do localStorage
    const name = localStorage.getItem('username') || '';

    return (
        <div>
            <div className="c-header flex bg-white p-4 ml-[51px] max-w-[100%] rounded-lg shadow-md">
                <div className="flex justify-around items-center w-full">
                    <h1 className="text-header text-xl font-bold"> Abstract</h1>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold">{name}</p>
                        <div>
                            <img src={iconAdm} className="w-[35px] h-[35px] rounded-full" alt="Icon Adm" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;
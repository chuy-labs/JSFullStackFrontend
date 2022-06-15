import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Alerta from '../components/Alerta';
import clienteAxios from '../config/axios';

const NuevoPassword = () => {

    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [alerta, setAlerta] = useState({});
    const [tokenValido, setTokenValido] = useState(false);
    const [passwordModificado, setPasswordModificado] = useState(false);

    const params = useParams();
    const {token} = params;

    useEffect(() => {
        const comprobarToken = async () => {

            // crear el usuario en la API
            try {
                await clienteAxios(`/veterinarios/olvide-password/${token}`);
                setAlerta({
                    msg: 'Coloca tu nuevo password'
                });
                setTokenValido(true);
            } catch (error) {
                setAlerta({
                    msg: 'Hubo un error con el enlace',
                    error: true
                });
            }
        }
        comprobarToken();
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();

        if([password, repeatPassword].includes('')) {
            setAlerta({msg: 'Hay campos vacíos', error: true});
            return;
        }

        if(password !== repeatPassword) {
            setAlerta({msg: 'Los passwords no son iguales', error: true});
            return;
        }

        if(password.length < 6) {
            setAlerta({msg: 'El password es muy corto, agrega minimo 6 caracteres', error: true});
            return;
        }

        setAlerta({});

        // crear el usuario en la API
        try {
            const url = `/veterinarios/olvide-password/${token}`;
            const {data} = await clienteAxios.post(url, { password });

            setAlerta({
                msg: data.msg
            });

            setPasswordModificado(true);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            });
        }
    }

    const {msg} = alerta;

    return (
        <>
            <div>
                <h1 className="text-indigo-600 font-black text-6xl">
                    Reestablece tu Password y no piertdas acceso a tus {''}
                    <span className="text-black">Pacientes</span>
                </h1>
            </div>

            <div className='mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white'>
                {msg &&
                    <Alerta
                        alerta={alerta}
                    />
                }
                { tokenValido && (
                    <>
                        <form action="" onSubmit={handleSubmit}>

                            <div className="my-5">
                                <label htmlFor="" className="uppercase text-gray-600 block text-xl font-bold">Nuevo Password</label>
                                <input
                                    type="password"
                                    placeholder="Tu Nuevo Password"
                                    className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="my-5">
                                <label htmlFor="" className="uppercase text-gray-600 block text-xl font-bold">Repetir Password</label>
                                <input
                                    type="password"
                                    placeholder="Repite tu Nuevo Password"
                                    className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                                    value={repeatPassword}
                                    onChange={e => setRepeatPassword(e.target.value)}
                                />
                            </div>

                            <input
                                    type="submit"
                                    value="Reestablecer Password"
                                    className="bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800 md:w-auto "
                            />
                        </form>
                        { passwordModificado &&
                            <Link
                                className='block text-center my-5 text-gray-500 hover:text-gray-700'
                                to="/">
                                Iniciar Sesión
                            </Link>
                        }
                    </>
                )}
            </div>
        </>
    );
}

export default NuevoPassword;
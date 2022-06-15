import { useState } from "react";
import AdminNav from "../components/AdminNav";
import Alerta from "../components/Alerta";
import useAuth from "../hooks/useAuth";

const CambiarPassword = () => {

    const { guardarPassword} = useAuth();

    const [password, setPassword] = useState({
        pwd_actual : '',
        pwd_nuevo : '',
        pwd_repetir : ''
    });

    const [alerta, setAlerta] = useState({});

    const handleSubmit = async e => {
        e.preventDefault();

        if(Object.values(password).some(campo => campo === '')) {
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            });
            return;
        }

        if(password.pwd_nuevo !== password.pwd_repetir) {
            setAlerta({msg: 'Los passwords no son iguales', error: true});
            return;
        }

        if(password.pwd_nuevo.length < 6) {
            setAlerta({msg: 'El password es muy corto, agrega minimo 6 caracteres', error: true});
            return;
        }

        const { pwd_repetir, ...passwordBD } = password;
        const respuesta = await guardarPassword(passwordBD);
        setAlerta(respuesta);
    }

    const {msg} = alerta;

    return (
        <>
            <AdminNav />

            <h2 className="font-black text-3xl text-center mt-10">Cambiar Password</h2>
            <p className="text-xl mt-5 mb-10 text-center">Modifica tu {''} <span className="text-indigo-600 font-bold">Password Aquí</span></p>

            <div className="flex justify-center">
                <div className="w-full md:w-1/2 bg-white shadow rounded-lg p-5">
                    {msg && <Alerta alerta={alerta} />}
                    <form action="" onSubmit={handleSubmit}>
                        <div className="my-3">
                            <label htmlFor="nombre" className="uppercase font-bold text-gray-600">Password Actual</label>
                            <input
                                type="password"
                                className="border bg-gray-50 w-full p-2 mt-5 rounded-lg"
                                name="pwd_actual"
                                placeholder="Tu Password Actual"
                                onChange={e => setPassword({
                                    ...password,
                                    [e.target.name] : e.target.value
                                })}
                            />
                        </div>

                        <div className="my-5">
                                <label htmlFor="" className="uppercase text-gray-600 block text-xl font-bold">Nuevo Password</label>
                                <input
                                    type="password"
                                    name="pwd_nuevo"
                                    placeholder="Tu Nuevo Password"
                                    className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                                    onChange={e => setPassword({
                                        ...password,
                                        [e.target.name] : e.target.value
                                    })}
                                />
                            </div>

                            <div className="my-5">
                                <label htmlFor="" className="uppercase text-gray-600 block text-xl font-bold">Repetir Password</label>
                                <input
                                    type="password"
                                    name="pwd_repetir"
                                    placeholder="Repite tu Nuevo Password"
                                    className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                                    onChange={e => setPassword({
                                        ...password,
                                        [e.target.name] : e.target.value
                                    })}
                                />
                            </div>

                        <input
                            type="submit"
                            value="Actualizar Password"
                            className="bg-indigo-700 px-10 py-3 font-bold text-white rounded-lg uppercase w-full mt-5 cursor-pointer hover:bg-indigo-800 transition-colors"
                        />
                    </form>
                </div>
            </div>
        </>
    )
}

export default CambiarPassword;
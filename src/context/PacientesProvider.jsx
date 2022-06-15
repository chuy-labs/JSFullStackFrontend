import { createContext, useState, useEffect } from "react";
import clienteAxios from "../config/axios";

const PacienteContext = createContext();

const PacientesProvider = ({children}) => {

    const [pacientes, setPacientes] = useState([]);
    const [paciente, setPaciente] = useState({});

    useEffect(() => {
        const obtenerPacientes = async () => {
            try {
                const token = localStorage.getItem('apv_token_auth');
                if(!token) return;

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const {data} = await clienteAxios('/pacientes', config);
                setPacientes(data)

            } catch (error) {
                console.log(error)
            }
        }
        obtenerPacientes();
    }, []);

    const guardarPaciente = async (paciente) => {

        const token = localStorage.getItem('apv_token_auth');
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        if(paciente.id) {
            try {
                const {data} = await clienteAxios.put(`/pacientes/${paciente.id}`, paciente, config);

                const pacientesAct = pacientes.map(pacienteState => pacienteState._id === data._id ? data : pacienteState);

                setPacientes(pacientesAct);
            } catch (error) {
                console.log(error.response.data.msg)
            }
        } else {
            try {
                const {data} = await clienteAxios.post('/pacientes', paciente, config);

                const { createdAt, updatedAt, __v, ...pacienteAlmacenado } = data;

                setPacientes([...pacienteAlmacenado, ...pacientes]);
            } catch (error) {
                console.log(error.response.data.msg)
            }
        }

    }

    const setEdicion = (paciente) => {
        setPaciente(paciente);
    }

    const eliminarPaciente = async (id, nombre) => {
        const confirmar = confirm(`¿Deseas eliminar a este paciente: ${nombre}?`);

        if(confirmar) {
            const token = localStorage.getItem('apv_token_auth');
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const {data} = await clienteAxios.delete(`/pacientes/${id}`, config);

                const pacientesActualizado = pacientes.filter(pacientesState => pacientesState._id !== id);

                setPacientes(pacientesActualizado);

            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <PacienteContext.Provider
            value={{
                pacientes,
                guardarPaciente,
                setEdicion,
                paciente,
                eliminarPaciente
            }}
        >
            {children}
        </PacienteContext.Provider>
    );
}

export {
    PacientesProvider
}

export default PacienteContext;
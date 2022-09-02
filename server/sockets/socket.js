const { Usuarios } = require('../classes/usuarios');
const { io } = require('../server');
const {crearMensaje} = require('../utils/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) =>{
        if(!data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            })
        }

        client.join(data.sala);

        usuarios.agregarPesona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPesonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unió el chat`));
        // regresar la lista de usuarios conectados por sala, solo mostrar la actualizacion a los usuarios de la misma sala
        callback(usuarios.getPesonasPorSala(data.sala));
    });

    client.on('crearMensaje', (data, callback)=>{
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    })

    client.on('disconnect', ()=>{
        // con esta funcion evitamos la duplicidad de usuarios al recargar la pagina
        let personaBorrada = usuarios.borrarPerona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPesonasPorSala(personaBorrada.sala));
    })

    // Mensajes privados
    client.on('mensajePrivado', data =>{
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    })

});
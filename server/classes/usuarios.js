
class Usuarios{

    constructor(){
        this.personas = [];
    }

    agregarPesona(id, nombre, sala){
        let persona ={id, nombre, sala}

        this.personas.push(persona);

        return this.personas;
    }

    // obtener una persona en particular por id
    getPersona(id){
        // let persona = this.personas.filter(persona =>{
        //     return persona.id = id
        // })[0];
        let persona = this.personas.filter(persona => persona.id === id)[0];//misma funcion que la anterior, solo que reducida a una sola linea

        return persona;
    }

    // Obtener a todas las personas
    getPersonas(){
        return this.personas;
    }

    getPesonasPorSala(sala){
        // TODO
        // let personasEnSala = this.personas.filter(persona =>{
        //     return persona.sala == sala
        // });
        let personasEnSala = this.personas.filter(persona => persona.sala == sala);
        return personasEnSala;
    }

    borrarPerona(id){
        // this.personas = this.personas.filter(persona =>{
        //     return persona.id != id
        // });
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(persona =>persona.id != id); //misma funcion que la anterior, solo que reducida a una sola linea
        return personaBorrada;
    }

}

module.exports = {Usuarios};
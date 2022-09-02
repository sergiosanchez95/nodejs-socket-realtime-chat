var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');

// referencias de jquery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

// Funciones para renderizar usuarios
function renderizarUsuarios(personas){
    // console.log(personas);

    var html ='';

    // html += '<li>';
    // html +=     '<a href="javascript:void(0)" class="active"> Chat de <span> '+ params.get('sala') +'</span></a>';
    // html += '</li>';
    html = `
        <li>
            <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala')}</span></a>
        </li>
    `;

    for(var i = 0; i<personas.length; i++){
        // html +='<li>'
        // html +=    '<a data-id="'+personas[i].id+'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span> '+ personas[i].nombre +' <small class="text-success">online</small></span></a>'
        // html +='</li>'
        html +=`<li>   
                    <a data-id="${personas[i].id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> 
                        <span> ${personas[i].nombre} <small class="text-success">online</small></span>
                    </a>
                </li>`;
    }

    // sustituimos el html que ya se encuentra de manera estatica, por el html que se esta generando en las lineas anteriores
    divUsuarios.html(html);
}

function renderizarMensajes(mensaje, yo){

    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';

    if(mensaje.nombre === 'Administrador'){
        adminClass = 'danger';
    }

    if(yo){
        html +=`
        <li class="reverse animated fadeIn">
            <div class="chat-content">
                <h5>${mensaje.nombre}</h5>
                <div class="box bg-light-inverse">${mensaje.mensaje}</div>
            </div>
            <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
            <div class="chat-time">${hora}</div>
        </li>
    `;
    }else{
        html += '<li class="animated fadeInUp">';
        if(mensaje.nombre !== 'Administrador'){
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += '<h5>'+mensaje.nombre+'</h5>';
        html += '<div class="box bg-light-'+adminClass+'">'+mensaje.mensaje+'</div>';
        html += '</div>';
        html += '<div class="chat-time">'+hora+'</div>';
        html += '</li>';
    }

   

    divChatbox.append(html);

}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


// Listeners ===========================================================================

// Cuando se de click en cualquier etiqueta a, se disparara la sigueinte funcion
divUsuarios.on('click', 'a', function(){
    // <a data-id> = .data('id')
    var id = $(this).data('id');

    if(id){
        console.log(id);
    }
});

formEnviar.on('submit', function(e){
    e.preventDefault();

    // trim() quita los espacios adelante y al final
    // con el siguiente if evitamos enviar mensajes vacios
    if(txtMensaje.val().trim() ===0 ){
        return;
    }

        socket.emit('crearMensaje', {
            usuario: nombre,
            mensaje: txtMensaje.val()
        }, function(mensaje) {
            txtMensaje.val('').focus();
            // renderizare los mensajes para mi que envie el mensaje
            // en socket-chat linea 42 se renderizaran los mensajes de quien recibe
            renderizarMensajes(mensaje, true);
            scrollBottom();
        });
});
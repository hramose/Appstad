var num = 1;
var limiteLinks = 11;
var inicioLinks = 1;
var finPAgs = 0;
var identificador = "";
var id = 0;
var id_pag_form = 1;
var datos_form = [];
var infoKiosko = []; //se utiliza para enviar informacion desde la primera seccion
					//del formualario altas, hacia la tercera seccion (llena el optionGroup de los kioskos);

$(document).ready(function(){

	$.ajax({
		url:'ajax/llenar-tabla',
		type:'get',
		datatype:'json',
		data: {num:0, identificador:"todo"},
		success:function(data){
			var datos = eval('(' + data + ')');
			finPAgs = datos[10]["Npags"];
			finPAgs = finPAgs + 1;
			for (var i = 0; i < datos.length-1; i++) {
				$("#DatosExistencias").append('<tr>'+
												'<td>'+datos[i].no_invent+'</td>'+
												'<td>'+datos[i].serie+'</td>'+
												'<td>'+datos[i].nombre+'</td>'+
												'<td>'+datos[i].articulo+'</td>'+
												'<td>'+datos[i].grupo+'</td>'+
												'<td>'+datos[i].id_loc+'</td>'+
												'<td>'+datos[i].localiza+'</td>'+
												'<td>'+
													'<div class="btn-group">'+
														'<a href="#" class="dropdown-toggle" data-toggle="dropdown">'+
														'<span class="icon-cog"> Opciones </span></a>'+
															'<ul class="dropdown-menu">'+
																'<li><a href="#" id="'+datos[i].id+'" class="move">Mover</a></li>'+
																'<li><a href="#" id="'+datos[i].id+'" class="delete">Eliminar</a></li>'+
															'</ul>'+
													'</div>'+
												'</td>'+
											  '</tr>');
			};

			for (var i = inicioLinks; i < limiteLinks; i++) {
				$("#paginacion").append('<a href="#" class="links" >'+i+'</a>&nbsp;');
			};
			$("#paginacion").append('&nbsp;<a href="#" class="links" id="siguiente">'+'Siguiente'+'</a>&nbsp;');
			$("#paginacion").append('<a href="#" class="links" id="ultimo">'+'>>'+'</a>');
			identificador = "todo";
		}

	});


//--------------------- TERMINA AJAX LLENAR TABLA --------------- INICIA EVENTO LINKS ----------

	$(document).on('click', ".links", function(event){
		event.preventDefault(); //evito que se refresque la pagina
		var pags = ($(this).html()); //guardo en la variable "pags" el valor del link (2, 3, 4 , >, >>, etc)
		var num = 0;

		var response = paginar(pags, limiteLinks, inicioLinks, finPAgs);
		limiteLinks = response[0];
		inicioLinks = response[1];

		$.ajax({
			url:'ajax/llenar-tabla',
			type:'get',
			datatype:'json',
			data: {id:id, num:pags, identificador:identificador},
			success:function(data){
				var datos = eval('(' + data + ')');
				$("#DatosExistencias").empty();
				for (var i = 0; i < datos.length-1; i++) {
					$("#DatosExistencias").append('<tr>'+
													'<td>'+datos[i].no_invent+'</td>'+
													'<td>'+datos[i].serie+'</td>'+
													'<td>'+datos[i].nombre+'</td>'+
													'<td>'+datos[i].articulo+'</td>'+
													'<td>'+datos[i].grupo+'</td>'+
													'<td>'+datos[i].id_loc+'</td>'+
													'<td>'+datos[i].localiza+'</td>'+
													'<td>'+
														'<div class="btn-group">'+
															'<a href="#" class="dropdown-toggle" data-toggle="dropdown">'+
															'<span class="icon-cog"> Opciones </span></a>'+
																'<ul class="dropdown-menu">'+
																	'<li><a href="#" id="'+datos[i].id+'" class="move">Mover</a></li>'+
																	'<li><a href="#" id="'+datos[i].id+'" class="delete">Eliminar</a></li>'+
																'</ul>'+
														'</div>'+
													'</td>'+
												  '</tr>');
				};

			}

		});

	});

// --------------------- TERMINA EVENTO LINKS ------------- INICIA EVENTO BUSQUEDAS -------------


	$(document).on('click', "#findBtn", function(event){
		event.preventDefault();
		var ValBusqueda = $('#findTxt').val();
		var val = ValBusqueda;

		$.ajax({
			url:'ajax/buscar',
			type:'post',
			datatype:'json',
			data: {val, val:ValBusqueda},
			success:function(data){
				var datos = eval('(' + data + ')');
				console.log(datos[0].no_hay);
				if(datos[0].no_hay == "No se encontraron registros"){
					alert(datos[0].no_hay);
				}else{
					$("#DatosExistencias").empty();
					for (var i = 0; i < datos.length; i++) {
						$("#DatosExistencias").append('<tr>'+
														'<td>'+datos[i].no_invent+'</td>'+
														'<td>'+datos[i].serie+'</td>'+
														'<td>'+datos[i].nombre+'</td>'+
														'<td>'+datos[i].articulo+'</td>'+
														'<td>'+datos[i].grupo+'</td>'+
														'<td>'+datos[i].id_loc+'</td>'+
														'<td>'+datos[i].localiza+'</td>'+
														'<td>'+
															'<div class="btn-group">'+
																'<a href="#" class="dropdown-toggle" data-toggle="dropdown">'+
																'<span class="icon-cog"> Opciones </span></a>'+
																	'<ul class="dropdown-menu">'+
																		'<li><a href="#" id="'+datos[i].id+'" class="move">Mover</a></li>'+
																		'<li><a href="#" id="'+datos[i].id+'" class="delete">Eliminar</a></li>'+
																	'</ul>'+
															'</div>'+
														'</td>'+
													  '</tr>');
					};
				}
				/*alert(data);
				console.log(data);*/

			}

		});
	});

});

// -------------------- TERMINA EVENTO BUSQUEDAS --------- EMPIEZA EVENTO LOGIN --------------------------

$(document).on('click', '#loginButton', function(event) {
	event.preventDefault();
	var username =$('#username').val();
	var password =$('#password').val();

	$.ajax({
		url:'ajax/login',
		type:'post',
		data: {username: username, password: password},
		dataType:'json',
		success: function(loggedIn){
			//alert(loggedIn);   // <-- eso se descomenta para mandar el alert con una password hasheada
			if(loggedIn){
				//Redirect a la parte de /hidden
				window.location = 'appstad';
			}
			else{
				//Limpia el campo de texto de la contraseña
				$('#password').val("");
				//Carga el texto de la alerta
				$('#msgText').html("Datos incorrectos, vuelve a intentarlo.");
				//Muestra la alerta
				$('#loginMsg').slideDown(400);
			}
		}
	});
});


function paginar (pags, limiteLinks, inicioLinks, finPAgs) {

	if (pags == "Siguiente") {  // INICIA condicion para mostrar paginado al precionar el lin "siguiente"

			limiteLinks = limiteLinks + 5;
			inicioLinks = inicioLinks + 5;

			$("#paginacion").empty();
			$("#paginacion").append('<a href="#" class="links" >'+'<<'+'</a>&nbsp;');
			$("#paginacion").append('<a href="#" class="links" >'+'Anterior'+'</a>&nbsp;');

			for (var i = inicioLinks; i < limiteLinks; i++) {
				$("#paginacion").append('<a href="#" class="links" >'+i+'</a>&nbsp;');
			}

			if(limiteLinks < finPAgs){ // condicion pa saber si ya llegue al limite de paginas

				$("#paginacion").append('&nbsp;<a href="#" class="links" id="siguiente">'+'Siguiente'+'</a>&nbsp;');
				$("#paginacion").append('<a href="#" class="links" id="ultimo">'+'>>'+'</a>');
			}

		} // ------------------ TERMINA CONDICION DEL LINK "SIGUIENTE" --------------------------------------


		if (pags == "Anterior") {  // INICIA condicion para mostrar paginado al precionar el lin "anterior"

			limiteLinks = limiteLinks - 5;
			inicioLinks = inicioLinks - 5;

			$("#paginacion").empty();

			if(inicioLinks > 1){ //condicion para saber si estoy mostrando el limite inicial de los links

				$("#paginacion").append('<a href="#" class="links" >'+'<<'+'</a>&nbsp;');
				$("#paginacion").append('<a href="#" class="links" >'+'Anterior'+'</a>&nbsp;');
			}

			for (var i = inicioLinks; i < limiteLinks; i++) {
				$("#paginacion").append('<a href="#" class="links" >'+i+'</a>&nbsp;');
			}

			$("#paginacion").append('&nbsp;<a href="#" class="links" id="siguiente">'+'Siguiente'+'</a>&nbsp;');
			$("#paginacion").append('<a href="#" class="links" id="ultimo">'+'>>'+'</a>');

		} // --------------------- TERMINA CONDICION DEL LINK "ANTEIROR" ---------------------------------

		if(pags == "&gt;&gt;"){  // >>
			limiteLinks = finPAgs;
			inicioLinks = finPAgs - 10;

			$("#paginacion").empty();
			$("#paginacion").append('<a href="#" class="links" >'+'<<'+'</a>&nbsp;');
			$("#paginacion").append('<a href="#" class="links" >'+'Anterior'+'</a>&nbsp;');

			for (var i = inicioLinks; i < limiteLinks; i++) {
				$("#paginacion").append('<a href="#" class="links" >'+i+'</a>&nbsp;');
			}

		}

		if(pags == "&lt;&lt;"){  // <<
			limiteLinks = 11;
			inicioLinks = 1;

			$("#paginacion").empty();

			for (var i = inicioLinks; i < limiteLinks; i++) {
				$("#paginacion").append('<a href="#" class="links" >'+i+'</a>&nbsp;');
			};
			$("#paginacion").append('&nbsp;<a href="#" class="links" id="siguiente">'+'Siguiente'+'</a>&nbsp;');
			$("#paginacion").append('<a href="#" class="links" id="ultimo">'+'>>'+'</a>');
		}

		var response = [limiteLinks, inicioLinks];
		return response;
}


$(document).on('click', '.alm', function(event) {
	id = this.id;

	$.ajax({
			url:'ajax/llenar-tabla',
			type:'get',
			datatype:'json',
			data: {id:id, num:0, identificador:"almacenes"},
			success:function(data){
				//console.log(data);

				var datos = eval('(' + data + ')');

				finPAgs = datos[10]["Npags"];
				finPAgs = finPAgs + 1;
				limiteLinks = finPAgs;

				if(datos[0].no_hay == "No se encontraron registros"){
					alert(datos[0].no_hay);
				}else{
					$("#DatosExistencias").empty();
					for (var i = 0; i < datos.length-1; i++) {
						$("#DatosExistencias").append('<tr>'+
														'<td>'+datos[i].no_invent+'</td>'+
														'<td>'+datos[i].serie+'</td>'+
														'<td>'+datos[i].nombre+'</td>'+
														'<td>'+datos[i].articulo+'</td>'+
														'<td>'+datos[i].grupo+'</td>'+
														'<td>'+datos[i].id_loc+'</td>'+
														'<td>'+datos[i].localiza+'</td>'+
														'<td>'+
															'<div class="btn-group">'+
																'<a href="#" class="dropdown-toggle" data-toggle="dropdown">'+
																'<span class="icon-cog"> Opciones </span></a>'+
																	'<ul class="dropdown-menu">'+
																		'<li><a href="#" id="'+datos[i].id+'" class="move">Mover</a></li>'+
																		'<li><a href="#" id="'+datos[i].id+'" class="delete">Eliminar</a></li>'+
																	'</ul>'+
															'</div>'+
														'</td>'+
													  '</tr>');
					};
					$("#paginacion").empty();
					for (var i = inicioLinks; i < limiteLinks; i++) {
						$("#paginacion").append('<a href="#" class="links" >'+i+'</a>&nbsp;');
					};
					if (limiteLinks > 10) {
					$("#paginacion").append('&nbsp;<a href="#" class="links" id="siguiente">'+'Siguiente'+'</a>&nbsp;');
					$("#paginacion").append('<a href="#" class="links" id="ultimo">'+'>>'+'</a>');
					};
					identificador = "almacenes";
				}


			}
		});

});

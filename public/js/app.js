//Listas Dobles

/* Instanciar un objeto de la clase lista*/
var list = new List()

function managerList(){
	/* Template String ge impresion de nodos*/
	var template = 'identificacion \t ::id:: \n nombre: \t ::nomb::  \n apellido:  \t ::apelli::  \n nota1: \t ::not1:: \n nota2: \t ::not2:: \n nota3: \t ::not3:: \n nota final: \t ::notfinal::',

		/* Ejecuta un alert con la informacion de un Nodo*/
		renderResult = function(result){
			alert(template
				.replace('::id::', result.id)
				.replace('::nomb::', result.nomb)
				.replace('::apelli::', result.apelli)
				.replace('::not1::', result.not1)
				.replace('::not2::', result.not2)
				.replace('::not3::', result.not3)
				.replace('::notfinal::', result.notfinal)
			)
		},
		keys = ['id','nomb','apelli','not1','not2','not3','notfinal','sig']

	/* Insertar nodos*/
	this.insert = function(){
		/* Seleccion de tipo de insercion*/
		var opcion = parseInt(prompt('1 : Insertat Cabeza \n2 : Insertat Cola \n3 : Insertar en Orden Alfabetico\n4 : Insertat en Posicion X')),
			point = null

		if(opcion != 1 && opcion != 2 && opcion != 3&& opcion != 4) throw new Error('Command Not Found')

		/* capturar informacion del nuevo nodo*/
		var identificacion = parseInt(prompt('Digite el numero de identificacion : ')),
			nombre =  prompt('Digite el nombre de la persona : '),
			apellido = prompt('Digite el apellido' ),
			nota1 = prompt('Digite la nota #1 : '),
			nota2 = prompt('Digite la nota #2 : '),
			nota3 = prompt('Digite la nota #3 : '),
			notadefinitiva = (nota1 + nota2 + nota3) / 3

		/* definir en en que posicion se insertara el nuevo nodo*/
		if (opcion == 1) point = 'head'
		if (opcion == 2) point = 'fail'
		if (opcion == 3) point = 'abc'
		if (opcion == 4) point = parseInt(prompt('Posicion: '))

		/* Enviar peticion al servidor*/
		var result = list.insert({
				point: point,
				info: {
					identificacion: identificacion,
					nombre: nombre,
					apellido: apellido,
					nota1: nota1,
					nota2: nota2,
					nota3: nota3,
					notadefinitiva: notadefinitiva
				}
			})
		if(result.err) return alert(result.err.msg)
		renderResult(result)
	}

	/* Mostrar la lista*/
	this.showList = function(){
		var directionUser = prompt('Escriba la direccion \n1 : Ascendente \n2 : Desendente')
		var direction = directionUser == 1 ? 1 : 0
		/* Enviar peticion al servidor*/
		var listNode = list.showList(direction)
		if(!listNode) return alert("Lista Vacia")
		var node = listNode
		
		if(direction){
			while(node != null){
				renderResult(node)
				node = node.sig
			}
		}else{
			while(node != null){
				renderResult(node)
				node = node.ant
			}

		}


	}

	/* Buscar nodos*/
	this.find = function(){
		/* capturar informacion para el proceso de busqueda*/
		/*
			attr : atributo por el cual se ejecuta el proceso
			operator : operador con el cual se va a realizar el proceso
			value : valor buscado
		*/

		var data = {
			attr: prompt('Criterio de la operacion (Busqueda) ' + keys),
			operator: parseInt(prompt('Escriba el operador a utilizar \n1 : Igualdad \n2 : Desigualdad \n3 : Mayor \n4 : Menor \n5 : Mayor o Igual \n6 : Menor o Igual')),
			value: prompt('Valor buscado')
		}

		var result = list.find(data)
		if (result.err) return alert(result.err.msg)
		for (var element of result.elements){renderResult(element)}

	}

	/* Editar nodos*/
	this.edit = function(){
		/* capturar informacion para el proceso de edicion*/
		/*
			attr : atributo por el cual se ejecuta el proceso
			operator : operador con el cual se va a realizar el proceso
			value : valor buscado
			newValue : nuevo valor
		*/

		var data = {
			attr: prompt('Criterio de la operacion (Edicion) ' + keys),
			operator: parseInt(prompt('Escriba el operador a utilizar \n1 : Igualdad \n2 : Desigualdad \n3 : Mayor \n4 : Menor \n5 : Mayor o Igual \n6 : Menor o Igual')),
			value: prompt('Valor buscado'),
			newValue: prompt('Nuevo valor')
		}

		/* Enviar peticion al servidor*/
		var result = list.edit(data)
		if (result.err) return alert(result.err.msg)
		for (var element of result.elements){renderResult(element)}

	}

	/* Borrar nodos*/
	this.delete = function(){
		/* capturar informacion para el proceso de eleminacion*/
		/*
			attr : atributo por el cual se ejecuta el proceso
			operator : operador con el cual se va a realizar el proceso
			value : valor buscado
		*/
		var data = {
			attr: prompt('Criterio de la operacion (Borrar) ' + keys),
			operator: parseInt(prompt('Escriba el operador a utilizar \n1 : Igualdad \n2 : Desigualdad \n3 : Mayor \n4 : Menor \n5 : Mayor o Igual \n6 : Menor o Igual')),
			value: prompt('Valor buscado')
		}

		var result = list.delete(data)
		if (result.err) return alert(result.err.msg)
		for (var element of result.elements){renderResult(element)}
	}
}

/* Instanciar un objeto de managerList */
var app = new managerList()

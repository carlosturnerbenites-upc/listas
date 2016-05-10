/*cambiar la referencia de ant al borrar un objeto*/

function List(){

	/*variables globales*/
	var primero = null,
		ultimo = null,
		aux = null,

		/* Verificacion de Lista vacio*/
		empty = function(){
			if(primero == null) return true
			return false
		},

		/* Verificacion de existencia de X nodo*/
		exists = function(dato){
			var exists = false,
				aux = primero
			do{
				if(aux.id == dato){
					exists = true
					break
				}
				aux = aux.sig
			}while (aux != primero)
			console.log("exists " + exists)
			return exists
		},

		/* Obtener el valor cualitativo de un operador de busqueda*/
		getOperator = function(codeNumber){
			var operator = ''
			switch(parseInt(codeNumber)){
			case 1:
				operator = '=='
				break
			case 2:
				operator = '!='
				break
			case 3:
				operator = '>'
				break
			case 4:
				operator = '<'
				break
			case 5:
				operator = '>='
				break
			case 6:
				operator = '<='
				break
			}
			return operator
		},
		counterElements = function(){
			aux = primero
			var count = 0
			do{
				count += 1
				aux = aux.sig
			}while (aux != primero)
			return count
		}

	/* Insertar nodos*/
	this.insert = function(data){
		var point =  data.point,
			identificacion =  data.info.identificacion,
			nuevo = null

		data.info.sig = null
		data.info.ant = null

		if(empty()){
			nuevo = new CustomNode(data)
			primero = nuevo
			ultimo = primero

			primero.sig = ultimo
			primero.ant = ultimo
		}else{
			if (exists(identificacion)) return ({err :{msg:'La Identificacion : ' + identificacion + 'ya esta registrada.'}})
			if(point == 'head'){
				nuevo = new CustomNode(data)

				nuevo.sig = primero
				nuevo.ant = primero.ant

				primero.ant = nuevo
				//primero.sig = ultimo

				primero = nuevo
				ultimo = primero.ant
				ultimo.sig = nuevo
			}else if (point == 'fail'){
				var aux = primero
				do{
					if(aux.sig == primero){
						nuevo = new CustomNode(data)
						aux.sig = nuevo
						nuevo.ant = aux
						nuevo.sig = primero
						ultimo = nuevo
						primero.ant = ultimo
						break
					}
					aux = aux.sig
				}while (aux != primero)
			}else if(point == 'abc'){
				/* Buscar los nodos con la informacion recibida*/
				var result = this.find({
					value : data.info.nombre,
					attr : 'nomb',
					operator : 3
				})

				/* Preguntar si no hubieron resultados - Retornar mensaje*/
				if (result.notFound){
					data.point = 'fail'
					return this.insert(data)
				}else{
					var elements = result.elements
					elements.sort((a,b) => {return(a.name > b.name)})
					var element = elements[0]
					nuevo = new CustomNode(data)

					if (element == primero){
						data.point = 'head'
						return this.insert(data)
					}else{
						if (element == ultimo) {
							ultimo = nuevo
							primero.ant = ultimo
						}
						element.ant.sig = nuevo
						nuevo.ant = element.ant
						nuevo.sig = element
						element.ant = nuevo
					}
				}
			}else if(typeof point == 'number'){
				var aux = primero,
					count = 1

				if(point < 1 || point > counterElements()) return ({err: {msg :'La posicion : ' + point + ' no es valida.'}})
				while (aux != null){
					if(count == point){
						nuevo = new CustomNode(data)
						if (aux == primero) {
							data.point = 'head'
							return this.insert(data)
						}else{
							if (aux == ultimo) {
								ultimo = nuevo
								primero.ant = ultimo
							}
							nuevo.sig = aux.sig
							nuevo.ant = aux
							aux.sig =  nuevo
						}
						break
					}

					count += 1
					aux = aux.sig
				}
			}
		}

		return (nuevo)
	}

	/* Mostrar la lista*/
	/* Retorna el primero nodo de la lista*/
	this.showList = function(direction) {
		console.log(primero)
		if(direction){return primero}
		else{
			var aux = primero
			do{
				if(aux.sig == primero){
					console.log(aux)
					return aux
				}
				aux = aux.sig
			}while(aux != primero)
		}
	}

	/* Buscar nodos*/
	this.find = function(data){
		/* Definicion de nodos auxiliares*/
		var aux = primero,
			/*boolean usado para saber si se encontraron nodos*/
			found = false


		/* Verificacion de lista vacio*/
		if(empty()) return {err: {msg :'No se encontraron objetos con ' + data.attr + ' = ' + data.value}, notFound: true}


		else{
			/* Verificar que la propiedad  mediante la cual se busca exista*/
			if(!aux.hasOwnProperty(data.attr)) return ({err: {msg : 'La propiedad ' + data.attr + ' no esta definidad.'}})

			/* Array de los nodos encontrado*/
			var elements = [],
				operator = getOperator(data.operator)

			do{
				/* Definir la condicion a ejecutar para la busqueda - tipo String*/
				var stringCode = 'aux[data.attr]' + operator + 'data.value'

				/* Evaluar la condicion*/
				if(eval(stringCode)){
					found = true

					/* Agregar el nodo concurrente al array*/
					/*
						current : nodo concurrente
					*/
					elements.push(aux)
				}

				/* Reasignacion de nodos auxiliares */

				aux = aux.sig
			}while (aux != primero)
			if(found){
				/*Si se encontraron nodos, los retorna*/
				return ({elements :elements})
			} else{
				/*Si no se encuentraron nodos, retorna mensaje*/
				return {err: {msg : 'No se encontraron objetos con ' + data.attr + ' = ' + data.value}, notFound: true}
			}
		}
	}

	/* Editar nodos*/
	this.edit = function(data){

		/* Buscar los nodos con la informacion recibida*/
		var result = this.find(data)

		/* Preguntar si no hubieron resultados - Retornar mensaje*/
		if (result.notFound) return ({err: {msg: 'No se encontraron objetos con ' + data.attr + ' = ' + data.value}})

		var elements = result.elements

		/* Recorre los nodos encontrado*/
		for (var element of elements){
			/* Si el attributo mediante el cual se edita el el id: se verifica que no existan y se agrega al array de ids existentes*/

			/* Verificar que el id no exista*/
			if (data.attr == 'id'){
				if (exists(data.newValue)) {return ({err : {msg:'La Identificacion : ' + data.newValue + ' ya esta registrada.'}})}
			}

			/* Actualizar le valor del nodo en el attributo indicado*/
			element[data.attr] = data.newValue

		}

		/* Retornar los elementos editados y la lista completa*/
		return ({elements : elements })
	}

	/* Borrar nodos*/
	this.delete = function(data){

		/* Buscar los nodos con la informacion recibida*/
		var result = this.find(data)

		/* Preguntar si no hubieron resultados - Retornar mensaje*/
		if (result.notFound) return ({err : {msg: 'No se encontraron objetos con ' + data.attr + ' = ' + data.value}})

		var elements = result.elements

		/* Recorre los nodos encontrado*/
		for (var element of elements){
			if(primero instanceof CustomNode){
				if (element == primero){
					/*Reasigna las referencia de los nodos*/
					if(primero.sig){
						primero = primero.sig
						primero.ant = ultimo
					}else{
						primero = null
					}
				}else{
					/*Borrar el id del nodo del Array de ids existentes*/
					/*Reasigna las referencia de los nodos*/
					if(element.sig){
						element.sig.ant = element.ant
						element.ant.sig = element.sig
					}else{
						element.ant.sig = null
					}
				}
			}else{
				primero = null
			}
		}
		/* Retornar los elementos borrados y la lista completa*/
		return ({elements: elements})
	}
}

/*cambiar la referencia de ant al borrar un objeto*/

function List(){

	/*variables globales*/
	var primero = null,
		aux = null,

		/* Array de ids existentes*/
		idsExists = [],

		/* Verificacion de Lista vacio*/
		empty = function(){
			if(primero == null) return true
			return false
		},

		/* Verificacion de existencia de X nodo*/
		exists = function(dato){
			var exists = (idsExists.indexOf(dato) == -1) ? false : true
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
			while (aux != null){
				count += 1
				aux = aux.sig
			}
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
			nuevo = new Node(data)
			primero = nuevo
		}else{
			if (exists(identificacion)) return ({err :{msg:'La Identificacion : ' + identificacion + 'ya esta registrada.'}})
			if(point == 'head'){
				data.info.sig = Object.assign({},primero)
				nuevo = new Node(data)
				nuevo.sig.ant = nuevo
				primero = nuevo
			}else if (point == 'fail'){
				var aux = primero
				while (aux != null){
					if(aux.sig == null){
						nuevo = new Node(data)
						aux.sig = nuevo
						nuevo.ant = aux
						break
					}
					aux = aux.sig
				}
			}else if(point == 'abc'){
				/* Buscar los nodos con la informacion recibida*/
				var result = this.find({
					value : data.info.nombre,
					attr : 'nomb',
					operator : 3
				})

				/* Preguntar si no hubieron resultados - Retornar mensaje*/
				if (result.notFound){
					var aux = primero
					while (aux != null){
						if(aux.sig == null){
							nuevo = new Node(data)
							aux.sig = nuevo
							nuevo.ant = aux
							break
						}
						aux = aux.sig
					}
				}else{

					var elements = result.elements
					elements.sort((a,b) => {return(a.name > b.name)})
					var element = elements[0]
					nuevo = new Node(data)
					console.log(elements)
					if (element.current == primero) {
						nuevo.sig = primero
						primero.ant = nuevo
						primero = nuevo
					}else{
						element.prev.sig = nuevo
						nuevo.ant = element.prev
						nuevo.sig = element.current
						element.current.ant = nuevo
					}
				}


			}else if(typeof point == 'number'){
				var aux = primero,
					count = 1

				if(point < 1 || point > counterElements()) return ({err: {msg :'La posicion : ' + point + ' no es valida.'}})
				while (aux != null){
					if(count == point){
						nuevo = new Node(data)
						if (aux == primero) {
							nuevo.sig = primero
							primero.ant = nuevo
							primero = nuevo
						}else{
							nuevo.sig = aux.sig
							aux.sig =  nuevo
						}
						break
					}

					count += 1
					aux = aux.sig
				}
			}
		}
		idsExists.push(identificacion)

		return ({new: nuevo})
	}

	/* Mostrar la lista*/
	/* Retorna el primero nodo de la lista*/
	this.showList = function() {console.info(primero);return primero}

	/* Buscar nodos*/
	this.find = function(data){
		/* Definicion de nodos auxiliares*/
		var aux = primero,
			prev = aux,
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

			while (aux != null){
				/* Definir la condicion a ejecutar para la busqueda - tipo String*/
				var stringCode = 'aux[data.attr]' + operator + 'data.value'

				/* Evaluar la condicion*/
				if(eval(stringCode)){
					found = true

					/* Agregar el nodo concurrente al array*/
					/*
						current : nodo concurrente
						prev : nodo anterios
					*/
					elements.push({current: aux, prev : prev})
				}

				/* Reasignacion de nodos auxiliares */
				prev = aux
				aux = aux.sig
			}
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
				if (exists(data.value)) {return ({err : {msg:'La Identificacion : ' + data.value + ' ya esta registrada.'}})}
			}

			/* Actualizar le valor del nodo en el attributo indicado*/
			element.current[data.attr] = data.newValue

			/*Agregar id al Array de ids existentes*/
			if (data.attr == 'id') idsExists.push(parseInt(data.value))
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

			if (element.current == primero){
				/*Reasigna las referencia de los nodos*/
				primero = primero.sig
				primero.ant = null
			}else{
				/*Borrar el id del nodo del Array de ids existentes*/
				idsExists = idsExists.filter(e => {return (e != element.current.id)})

				/*Reasigna las referencia de los nodos*/
				element.current.sig.ant = elements.prev
				element.prev.sig = element.current.sig
			}
		}
		/* Retornar los elementos borrados y la lista completa*/
		return ({elements: elements})
	}
}

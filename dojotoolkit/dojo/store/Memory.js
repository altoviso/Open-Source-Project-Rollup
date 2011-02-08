define("dojo/store/Memory", ["dojo", "dojo/store/util/QueryResults", "dojo/store/util/SimpleQueryEngine"], function(dojo) {

dojo.store.Memory = function(/*dojo.store.Memory*/ options){
	// summary:
	//		This is a basic in-memory object store.
	// options:
	//		This provides any configuration information that will be mixed into the store.
	//		This should generally include the data property to provide the starting set of data.
	var store = {
		data:[],
		idProperty: "id",
		index:{},
		queryEngine: dojo.store.util.SimpleQueryEngine,
		get: function(id){
			return this.index[id];
		},
		getIdentity: function(object){
			return object[this.idProperty];
		},
		put: function(object, options){
			var id = options && options.id || object[this.idProperty] || Math.random();
			this.index[id] = object;
			var data = this.data,
				idProperty = this.idProperty;
			for(var i = 0, l = data.length; i < l; i++){
				if(data[i][idProperty] == id){
					data[i] = object;
					return id;
				}
			}
			this.data.push(object);
			return id;
		},
		add: function(object, options){
			if(this.index[options && options.id || object[this.idProperty]]){
				throw new Error("Object already exists");
			}
			return this.put(object, options);
		},
		remove: function(id){
			delete this.index[id];
			var data = this.data,
				idProperty = this.idProperty;
			for(var i = 0, l = data.length; i < l; i++){
				if(data[i][idProperty] == id){
					data.splice(i, 1);
					return;
				}
			}
		},
		query: function(query, options){
			return dojo.store.util.QueryResults(this.queryEngine(query, options)(this.data));
		},
		setData: function(data){
			if(data.items){
				// just for convenience with the data format IFRS expects
				this.idProperty = data.identifier;
				data = this.data = data.items;
			}else{
				this.data = data;
			}

			for(var i = 0, l = data.length; i < l; i++){
				var object = data[i];
				this.index[object[this.idProperty]] = object;
			}
		}
	};
	dojo.mixin(store, options);
	store.setData(store.data);
	return store;
};
/*=====
dojo.declare("dojo.store.Memory", null, {
	// data: Array
	//		The array of all the objects in the memory store
	data:[],

	// idProperty: String
	//		Indicates the property to use as the identity property. The values of this
	//		property should be unique.
	idProperty: "id",

	// index: Object
	//		An index of data by id
	index:{},

	// queryEngine: Function
	//		Defines the query engine to use for querying the data store
	queryEngine: dojo.store.util.SimpleQueryEngine,
	get: function(id){
		// summary:
		//		Retrieves an object by its identity
		// id: Number
		//		The identity to use to lookup the object
		// returns: Object
		//		The object in the store that matches the given id.
	},
	getIdentity: function(object){
		// summary:
		//		Returns an object's identity
		// object: Object
		//		The object to get the identity from
		// returns: Number
	},
	put: function(object, options){
		// summary:
		//		Stores an object
		// object: Object
		//		The object to store.
		// options: Object?
		//		Additional metadata for storing the data.  Includes an "id"
		//		property if a specific id is to be used.
		// returns: Number
	},
	add: function(object, options){
		// summary:
		//		Creates an object, throws an error if the object already exists
		// object: Object
		//		The object to store.
		// options: Object?
		//		Additional metadata for storing the data.  Includes an "id"
		//		property if a specific id is to be used.
		// returns: Number
	},
	remove: function(id){
		// summary:
		//		Deletes an object by its identity
		// id: Number
		//		The identity to use to delete the object
	},
	query: function(query, options){
		// summary:
		//		Queries the store for objects.
		// query: Object
		//		The query to use for retrieving objects from the store.
		// options: dojo.store.util.SimpleQueryEngine.__queryOptions?
		//		The optional arguments to apply to the resultset.
		// returns: dojo.store.util.QueryResults
		//		The results of the query, extended with iterative methods.
		//
		// example:
		//		Given the following store:
		//
		//	|	var store = new dojo.store.Memory({
		//	|		data: [
		//	|			{id: 1, name: "one", prime: false },
		//	|			{id: 2, name: "two", even: true, prime: true},
		//	|			{id: 3, name: "three", prime: true},
		//	|			{id: 4, name: "four", even: true, prime: false},
		//	|			{id: 5, name: "five", prime: true}
		//	|		]
		//	|	});
		//
		//	...find all items where "prime" is true:
		//
		//	|	var results = store.query({ prime: true });
		//
		//	...or find all items where "even" is true:
		//
		//	|	var results = store.query({ even: true });
	},
	setData: function(data){
		// summary:
		//		Sets the given data as the source for this store, and indexes it
		// data: Object[]
		//		An array of objects to use as the source of data.
	}
});
=====*/
return dojo.store.Memory;
});
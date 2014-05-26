'use strict';

var DSLoader = (function() {

	/**
     * Get the JSON data
     *
	 * @param        {Object}    name the name of the data source
     * @param        {Object}    path the URL of the data source
     * @param  {Object} callback a function that it called once the data has been loaded 
     */	
	function getData(name, path, callback){
	    var xmlhttp = new XMLHttpRequest();
	    xmlhttp.overrideMimeType('application/json');  
	    xmlhttp.onreadystatechange = function() {
	    	//check if request was successful
	        if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 0)) {
	        	callback(name, JSON.parse(xmlhttp.responseText));
	        }
	    };
	    xmlhttp.open('GET', path, true);
	    xmlhttp.send();
	}

	/**
     * Data Source Loader. Retrieves JSON data from a path
     *
     * @constructor
     * @param        {Object}    name the name of the data source
     * @param        {Object}    path the URL of the data source
     */
	function DSLoader(name, path) {
		var self = this;

		/**
	     * Get the JSON data
	     *
	     * @param  {Object} callback a function that it called once the data has been loaded 
	     */
		self.get = function(callback){ 
			getData(name, path, callback);
		};
	}
	return DSLoader;
})();
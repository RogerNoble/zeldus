'use strict';

/**
 * @license Zeldus Copyright (c) 2014, Roger Noble All Rights Reserved.
 * Licensed under MIT.
 * See https://raw.githubusercontent.com/RogerNoble/zeldus/master/LICENSE
 */
define([
	'utils/QueryParser',
	'blocks/BasicBlock',
	'common/OperatorFactory',
	'common/ResultPrinter'], 
	function(QueryParser, BasicBlock, OperatorFactory, ResultPrinter) {
	var tables = {};

	/**
     * runs the execution plan and returns a result to the callback
     * @param        {Object}    executionPlan an execution plan generated by the QueryParser
     * @param        {Object}    callback callback fucntion called once a result is ready
     */
	function runQuery(executionPlan, callback){
		
		var factory = new OperatorFactory(tables);

		//start timer
		var queryStart = new Date();

		//output column names
		var columns = executionPlan.children.map(function(column){ return column.column; }),
			tree = factory.get(executionPlan);
		var result = new ResultPrinter(
			tree,
			columns
		);		

		result.getJSON(function(data){
			var queryEnd = new Date();
			console.log('Query execution: ' + ((queryEnd - queryStart) / 1000) + ' seconds');
			callback(data);
		});
	}

	/**
     * Zeldus
     * @param        {Object}    options a configuration object
     */
    function Zeldus(options) {
    	var self = this;
    	
		//setup tables
		if(options.dataSource){
			self.loadStart = new Date();
			for(var i = 0; i < options.dataSource.length; i++){
				options.dataSource[i].get(loadTable);
			}
		}

		/**
	     * Create a projection for a given table
	     *
	     * @param {Object} name the name of the projection
	     * @param {Object} projection
	     */
		self.createProjection = function(name, projection){ 

		};

		/**
	     * Execute a query and return the results to a callback function
	     *
	     * @param {Object} query an SQL query
	     * @param {Object} callback a callback function
	     */
		self.execute = function(query, callback) { 
			//parse query to generate plan
			var parser = new QueryParser();
			var executionPlan = parser.parse(query);
			console.log(JSON.stringify(executionPlan));
			//run plan
			runQuery(executionPlan, callback);
		};

		/**
	     * Load data into a table of columns
	     *
	     * @param {Object} tableName the name of the table
	     * @param {Object} results the result of a data load
	     */
		function loadTable(tableName, results){
			tables[tableName] = {};
			for(var i = 0; i < results.length; i++){
				for(var column in results[i]){
					if (results[i].hasOwnProperty(column)) {
						//create columns
						if(tables[tableName][column] === undefined){
							tables[tableName][column] = [];
						}
						//add blocks (uncompressed)
						tables[tableName][column].push(new BasicBlock(results[i][column], i));
					}
				}
			}
			var loadEnd = new Date();
			console.log('Data load: ' + ((loadEnd - self.loadStart) / 1000) + ' seconds');
		}
	}

	return Zeldus;
});
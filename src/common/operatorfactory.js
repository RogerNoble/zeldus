'use strict';

define([
	'operators/AndOperator', 
	'operators/DataSourceOperator', 
	'operators/CountOperator', 
	'operators/SelectOperator', 
	'operators/SumOperator', 
	'operators/Predicate'], 
	function(AndOperator, DataSourceOperator, CountOperator, SelectOperator, SumOperator, Predicate) {

	/**
     * The Operator Factory is used to instance the operators needed to run a given execution plan
     *
     * @constructor
     * @param        {Object}    tables an array of tables
     */
	function OperatorFactory(tables) {
		var self = this,
			//operators array used to select an operator
			operators = {
				'and': AndOperator, 
				'count': CountOperator, 
				'ds': DataSourceOperator,
				'select': SelectOperator,
				'sum': SumOperator
			};
		self.tables = tables;

		//construct polyfill
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
		if(!Function.prototype.construct){
	    	Function.prototype.construct = function (aArgs) {
			    var fConstructor = this, FNewConstr = function () { fConstructor.apply(this, aArgs); };
			    FNewConstr.prototype = fConstructor.prototype;
			    return new FNewConstr();
			};
		}

		/**
	     * Get the operator tree for a given execution plan
	     *
	     * @param  {Object} operator an execution plan
	     * @return {Object} operator instances
	     */
		self.get = function(operator){
			var args = [];
			
			//columns
			if(operator.table !== undefined && operator.column !== undefined){
				//check table and column exists
				if(self.tables[operator.table] !== undefined && self.tables[operator.table][operator.column] !== undefined)
					args.push(self.tables[operator.table][operator.column]);
				else
					throw 'column ' + operator.column + ' does not exist';
			}
			//predicates
			if(operator.predicate !== undefined)
				args.push(new Predicate(operator.predicate.value, operator.predicate.type));
			//filters
			if(operator.filter !== undefined){
				if(operator.filter.length === 0)
					args.push(null); //empty filter
				else{
					for(var i = 0; i < operator.filter.length; i++)
						args.push(this.get(operator.filter[i]));
				}
			}			
			//child operators
			if(operator.children !== undefined){
				for(var i = 0; i < operator.children.length; i++)
					args.push(this.get(operator.children[i]));
			}
			//create types
			return operators[operator.type].construct(args);
		};
	}
	return OperatorFactory;
});
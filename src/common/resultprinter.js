'use strict';

define(['operators/Operator', 'blocks/Block'], function(Operator, Block) {
	
	/**
     * Result printer is a simple operator that is used to convert blocks to JSON
     *
     * @constructor
     * @param        {Object}    childOperator the root operator
     * @param        {Object}    columns an array of output column names in the correct order
     */
	function ResultPrinter(childOperator, columns) {
		var self = this;

		/**
	     * Get the JSON result of an operator
	     *
	     * @param  {Object} callback executes the callback function once completed passing the JSON result
	     */
		self.getJSON = function(callback){
			var json = [],
				next = childOperator.getNextValueBlock();

			//null check
			if(next == null){
				callback(json);
				return;
			}

			do{
				if(next instanceof Block)
					json[columns[0]] = next.getNext().value;
				else if(next.length > 0){
					for(var i = 0; i < next.length; i++){
						var row = {};
						for(var j = 0; j < next[i].length; j++)
							if(next[i][j] instanceof Block)
								row[columns[j]] = next[i][j].getNext().value; //need to check column length!
						json.push(row);
					}
				}
				next = childOperator.getNextValueBlock();
			}while(next != null);
			callback(json);
		};
	}
	return ResultPrinter;
});
'user strict';

define(['operators/Operator', 'blocks/BasicBlock'], function(Operator, BasicBlock) {

	/**
     * Sum operator. Combines multiple columns together based on an optional filter operator. Includes a sum aggregation
     *
     * @constructor
     * @param        {Object}    filterOperator optional filter operator
     * @param        {Object}    childOperator a series of child operators to combine into a single row. Multiple child operators can be added
     */
	function SumOperator(filterOperator, childOperator){
		var self = this;
		self.index = 0;
		self.operators = arguments;

		//validate arguments
		if(filterOperator != null && !(filterOperator instanceof Operator))
			throw 'Filter operator is not an instance of Operator.';
		if(!(childOperator instanceof Operator))
			throw 'Child operator is not an instance of Operator.';

        Operator.call(this, childOperator);

        /**
	     * Get the next matching row block from the child operators
	     *
	     * @return  {Object} an array of value blocks
	     */
        self.getNextValueBlock = function(){
        	var block = null,
        		results = [],	
        		stop = false;

			if(this.childOperator != null){
				while(!stop){
					var position = null,
						row = [];
					//get next position from filter
					if(filterOperator != null){
						var filterBlock = filterOperator.getNextValueBlock();
						position = filterBlock != null ? filterBlock.getNext().position : null;
						//if position is null then we've reached the end
						if(position == null)
							stop = true;
					}

					if(!stop){
						for(var i = 1; i < self.operators.length; i++){
							block = self.operators[i].getNextValueBlock(position);
							if(block != null)
								row.push(block);
							else{
								stop = true;
								break;
							}
						}
					}
					if(!stop)
						results.push(row);
				}
			}
			return results.length > 0 ? results : null;
		};

		/**
	     * Get the next position block
	     */
		self.getNextPositionBlock = function(){
			
		};
	}

	SumOperator.prototype = Object.create(Operator.prototype);
    SumOperator.prototype.constructor = SumOperator;

	return SumOperator;
});
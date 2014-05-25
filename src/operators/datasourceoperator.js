'user strict';

define(['operators/Operator', 'operators/Predicate'], function(Operator, Predicate) {

	/**
     * Data Source operator. Base operator, retrieves data from a column source
     *
     * @constructor
     * @param        {Object}    column the source column
     * @param        {Object}    predicate a Predicate object to filter the column
     * @param        {Object}    childOperator
     */
	function DataSourceOperator(column, predicate, childOperator){
		var self = this;
		self.childOperator = childOperator;
		self.column = column;
		self.index = 0;

		if(predicate != null && !(predicate instanceof Predicate))
			throw 'Predicate is not an instance of Predicate';

        Operator.call(this, childOperator);

        /**
	     * Get the next matching block from the column, filtered by a predicate
	     *
	     * @return  {Object} value block
	     */
        self.getNextValueBlock = function(position){
        	
        	var block = GetNextBlock(position);
        	var pass = false;
        	do{
        		if(block == null)
        			pass = true;
				else if(predicate == null || (predicate != null && (predicate instanceof Operator || predicate.evaluate(block.getNext()))))
					pass = true;
				else
					block = GetNextBlock(position);
			}while(!pass);
			return block;
		};

		/**
	     * Get the next position block
	     */
		self.getNextPositionBlock = function(){
				
		};

		/**
	     * Get a block at an index
	     *
	     * @param  {number} position the column index
	     * @return  {Object} value block
	     */
		function GetNextBlock(position){
			var block = null;
	        	//get next block from child
				if(self.childOperator != null){
					block = self.childOperator.getNextValueBlock();
				//get next block from column at position
				}else if(position != null && position < column.length){
					block = self.column[position];
					self.index = position + 1;
				}
				//get next block from column
				else if(self.column !== undefined && self.column.length > self.index){
					block = self.column[self.index];
					self.index++;
				}
			return block;
		}
	}

	DataSourceOperator.prototype = Object.create(Operator.prototype);
    DataSourceOperator.prototype.constructor = DataSourceOperator;

	return DataSourceOperator;
});
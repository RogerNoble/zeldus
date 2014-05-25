'user strict';

define(['operators/Operator', 'blocks/BasicBlock'], function(Operator, BasicBlock) {
	var index = 0;

	/**
     * Count operator. TODO.
     *
     * @constructor
     * @param        {Object}    childOperator a child operator
     */
	function CountOperator(childOperator){
		var self = this;
        Operator.call(this, childOperator);

        /**
	     * Get the next matching block from both left and right operators
	     *
	     * @return  {Object} value block
	     */
        self.getNextValueBlock = function(){
        	var block = null,
        		count = 0;

			if(this.childOperator != null){
				block = this.childOperator.getNextValueBlock();
				if(block == null)
					return null;
				
				do{
					count += block.getSize();
					block = this.childOperator.getNextValueBlock();
				}while(block != null);
			}
			return new BasicBlock(count, 0);
		};

		/**
	     * Get the next position block
	     */
		self.getNextPositionBlock = function(){
			
		};
	}

	CountOperator.prototype = Object.create(Operator.prototype);
    CountOperator.prototype.constructor = CountOperator;

	return CountOperator;
});
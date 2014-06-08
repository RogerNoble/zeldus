'use strict';

define(['operators/Operator', 'blocks/BasicBlock'], function(Operator, BasicBlock) {
	var index = 0;

	/**
     * And operator. Combines two child operators and returns a position block when matched
     *
     * @constructor
     * @param        {Object}    leftOperator the left side of the and statement
     * @param        {Object}    rightOperator the right side of the and statement
     */
	function AndOperator(leftOperator, rightOperator){
		var self = this;
		this.rightOperator = rightOperator;
        Operator.call(this, leftOperator);

        /**
	     * Get the next matching block from both left and right operators
	     *
	     * @return  {Object} position block
	     */
        self.getNextValueBlock = function(){
        	if(this.childOperator != null && this.rightOperator != null){
				var left = this.childOperator.getNextValueBlock();
				var right = this.rightOperator.getNextValueBlock();

				//null check
				if(left == null || right == null)
					return null;
				//if the positions are equal
				if(left.position === right.position)
					return new BasicBlock(true, left.position);

				//find a matching position...
				var found = false;
				do{
					if(left == null || right == null)
						found = true;
					else if(left.position === right.position)
						found = true;
					else if(left.position > right.position)
						right = this.rightOperator.getNextValueBlock();
					else if(left.position < right.position)
						left = this.childOperator.getNextValueBlock();
				}while(!found);
				if(left == null || right == null)
					return null;
			}
			return new BasicBlock(true, left.position);
		};

		/**
	     * Get the next position block
	     */
		self.getNextPositionBlock = function(){
			
		};
	}

	AndOperator.prototype = Object.create(Operator.prototype);
    AndOperator.prototype.constructor = AndOperator;

	return AndOperator;
});
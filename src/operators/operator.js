'use strict';

define(function() {

	/**
     * Abstract object. Provides core methods for all operator types
     */
	function Operator(childOperator) {
		var self = this;
		self.childOperator = childOperator;
		self.getNextValueBlock = function(){};
		self.getNextPositionBlock = function(){};
	}
	return Operator;
});
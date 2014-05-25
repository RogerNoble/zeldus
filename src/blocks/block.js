'use strict';

define(function() {

	/**
     * Abstract object. Provides core methods for all block types
     */
	function Block() {
		var self = this;

		self.hasNext = function(val){};
		self.getNext = function(){};
		self.peekNext = function(){};
		self.getPairAtLoc = function(loc){};
		self.getCurrLoc = function(){};
		self.getSize = function(){};
		self.resetBlock = function(){};

		self.isValueSorted = function(){ return true; };
		self.isPosSorted = function(){ return true; };
		self.isOneValue = function(){ return true; };
		self.isPosContiguous = function(){ return true; };
		self.isBlockValueSorted = function(){ return true; };
		self.isBlockPosSorted = function(){ return true; };
	}
	return Block;
});
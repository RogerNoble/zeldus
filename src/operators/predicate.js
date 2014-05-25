'use strict';

define(function() {

	/**
     * Predicate. Used to filter a column
     *
     * @constructor
     * @param        {Object}    value the predicate value
     * @param        {Object}    type the type of predicate
     */
	function Predicate(value, type) {
		var self = this;
		this.value = value;
		this.type = type;
		/**
	     * Get the next matching block from the column, filtered by a predicate
	     * Predicates
		 * E 	Equals
		 * GT 	Greater Than
		 * LT 	Less Than
		 * GTE 	Greater Than or Equal to
		 * LTE 	Less Than or Equal to
		 * NE 	Not Equal
	     *
	     * @return  {Boolean} True if predicate was satisfied
	     */
		self.evaluate = function(lhBlock){
			var result = false;
			switch(this.type){
				case 'GT':
					result = lhBlock.value > this.value;
					break;
				case 'GTE':
					result = lhBlock.value >= this.value;
					break;
				case 'LT':
					result = lhBlock.value < this.value;
					break;
				case 'LTE':
					result = lhBlock.value <= this.value;
					break;
				case 'NE':
					result = lhBlock.value !== this.value;
					break;
				default:
					result = lhBlock.value === this.value;
					break;
			}
			return result;
		};
	}
	return Predicate;
});
'use strict';

define(['blocks/Block'], function(Block) {
	var value = null;

	/**
     * A basic uncompressed data block
     *
     * @constructor
     * @param        {Object}    blockValue the value of the block
     * @param        {Object}    blockPosition the position/index of the block
     */
	function BasicBlock(blockValue, blockPosition){
		var self = this;
		Block.call(this);
		this.value = blockValue;
		this.position = blockPosition;

		/**
	     * Get the next value in the block.
	     * As the basic block is uncompressed only one value is stored
	     *
	     * @return {Object} containing the value and position
	     */
		self.getNext = function(){ return { value: this.value, position: this.position }; };
		/**
	     * Get the size of the block (number of elements).
	     *
	     * As the basic block is uncompressed the size is always 1
	     * @return {number} containing the value and position
	     */
		self.getSize = function(){ return 1; };
		/**
		 * Exports
		 *
		 * @ignore
		 */
	}

	BasicBlock.prototype = Object.create(Block.prototype);
    BasicBlock.prototype.constructor = BasicBlock;

	return BasicBlock;
});
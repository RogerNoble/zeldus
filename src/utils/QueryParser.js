'use strict';

define(function() {
	
	/**
     * parse where clause
     *
	 * @param {Object} sourceTable the name of the source table
     * @param {Object} query the query to parse
     * @return {Object} an array of data source operators with predicates
     */	
	function parseWhere(sourceTable, query) {
		if(query === undefined)
			return null;

		var logicalOperators = ['and', 'or'],
			comparisonOperators = ['=', '>', '<', '>=', '<=', '<>', '!='],
			comparisonOperatorNames = ['E', 'GT', 'LT', 'GTE', 'LTE', 'NE', 'NE'];

		//first split out logical operators
		var logicalSplit = query.split(new RegExp('( ' + logicalOperators.join(' | ') + ' )'));
		logicalSplit = logicalSplit.map(function(l){ return l.trim(); });

		var predicates = [],
			logicalOperator = { type: null, children: [] };
		for(var i = 0; i < logicalSplit.length; i++){
			if(logicalOperators.indexOf(logicalSplit[i].toLowerCase()) < 0){
				var comparisonSplit = logicalSplit[i].split(new RegExp('(' + comparisonOperators.join('|') + ')')),
					predicate = { value: null, type: null };
				comparisonSplit = comparisonSplit.map(function(l){ return l.trim(); });

				if(comparisonSplit.length === 3){
					//predicate
					var comparisonIndex = comparisonOperators.indexOf(comparisonSplit[1]);
					if(comparisonIndex >= 0)
						predicate.type = comparisonOperatorNames[comparisonIndex];
					//value
					predicate.value = parseValue(comparisonSplit[2]);
					//data source
					predicates.push({ type: 'ds', table: sourceTable, column: comparisonSplit[0], predicate: predicate });
				}
			}else{
				//logical operator
				logicalOperator.type = logicalSplit[i];
			}
		}
		if(predicates.length <= 1)
			return predicates;
		else if(predicates.length > 1 && logicalOperator.type != null){
			//set logical operator
			logicalOperator.children = predicates;
			return logicalOperator;
		}else
			return null;
	}

	/**
     * parse select clause
     *
	 * @param {Object} sourceTable the name of the source table
     * @param {Object} query the query to parse
     * @return {Object} an array of data source operators without predicates
     */	
	function parseSelect(sourceTable, query) {
		var columns = query.split(','),
			select = { type: 'select', filter: [], children: [] };
		//remove leading/trailing whitespace
		columns = columns.map(function(c){ return c.trim().toLowerCase(); });
		for(var i = 0; i < columns.length; i++){
			select.children.push({ type: 'ds', table: sourceTable, column: columns[i] });
		}
		return select;
	}

	/**
     * identifies a data type, checks for number, date then string
     *
	 * @param {Object} value the value to parse
     * @return {Object} the values converted into its native type
     */
	function parseValue(value){
		//int or decimal?
		var number = +value;
		if(!isNaN(number))
			return number;

		//date?
		var date = Date.parse(value);
		if(!isNaN(date))
			return number;

		//string
		return value;
	}

	/**
     * Query Parser
     * Parses a SQL query into an execution plan - a tree of operators
     *
     * @constructor
     */
	function QueryParser() {
		var self = this,
			keywords = ['select', 'from', 'where', 'sum', 'count', 'join'];

		/**
	     * Parse
	     *
		 * @param {Object} query an SQL query
	     * @return {Object} an execution plan
	     */
		self.parse = function(query){
			/*
			** SQL **
			select L_SHIPMODE, sum(L_EXTENDEDPRICE)
		  	from LINEITEM
		  	where 
				L_SUPPKEY = 777
				and convert(varchar(20), L_SHIPDATE, 112) > 19961101
		  	group by L_SHIPMODE

			** Manual Execution Plan
			//aggregate on shipmode and extendedprice
			var result = new ResultPrinter(
				new SumOperator(
					new AndOperator(
						//filter on shipdate and supplier key
						new DataSourceOperator(table.shipdate, new Predicate(19961101, 'GT')),
						new vOperator(table.supplierkey, new Predicate(777, 'E'))
					),
					new DataSourceOperator(table.shipmode),
					new DataSourceOperator(table.extendedprice)
				),
				['shipmode', 'extendedprice']
			);
			*/

			//execution plan
			var executionPlan = {
				type: '',
				filter: [],
				children: []
			};

			//tidy up
			query = query.replace(/(\r\n|\n|\r)/gm, '');
			//split stirng into keywords
			var tokens = query.split(new RegExp('(' + keywords.join('|') + ')'));
			var currentKeyword = null,
				parts = {};
			for(var i = 0; i < tokens.length; i++){
				if(tokens[i].length > 0){
					if(keywords.indexOf(tokens[i]) >= 0)
						currentKeyword = tokens[i];
					else{
						parts[currentKeyword] = tokens[i].trim();
						currentKeyword = null;
					}
				}
			}

			//from - determine source table
			var sourceTable = parts.from;

			//where
			var where = parseWhere(sourceTable, parts.where);

			//select
			var select = parseSelect(sourceTable, parts.select);

			if(where != null){
				//where has a logical operator
				if(where.type !== undefined)
					select.filter.push(where);
				//where has child data source operators
				else if(where.length > 0){
					//set as either filter or children
					for(var i = 0; i < where.length; i++){
						var found = false,
							j = 0;
						for(; j < select.children.length; j++){
							if(select.children[j].table === where[i].table && select.children[j].column === where[i].column){
								found = true;
								break;
							}
						}
						//if the perdicate (where) is part of the selected columns, then add it as a child data source
						if(found)
							select.children[j] = where[i];
						else
						//else add the predicate as a filter
							select.filter.push(where[i]);
					}
				}
			}

			return select;
			/*
			return {
				type: 'sum',
				filter: [
					{
						type: 'and',
						children: [
							{
								type: 'ds',
								table: 'lineitem',
								column: 'shipdate',
								predicate: { value: 19961101, type: 'GT' }
							},
							{
								type: 'ds',
								table: 'lineitem',
								column: 'lineitem.supplierkey',
								predicate: { value: 777, type: 'E' }
							}
						]
					}
				],
				children: [
					{
						type: 'ds',
						table: 'lineitem',
						column: 'shipmode'
					},
					{
						type: 'ds',
						table: 'lineitem',
						column: 'extendedprice'
					}
				]
			};
			*/
		};
	}
	return QueryParser;
});
define(['utils/QueryParser', 'chai'], function( QueryParser, chai ) {
    var expect = chai.expect;
    var assert = chai.assert;

	describe('QueryParser', function() {
		describe('parse', function() {
			it('should be of type select with one child data source', function() {
				var parser = new QueryParser(),
					query = 'select shipdate from lineitem',
					expected = { type: 'select', filter: [], children: [{ type: 'ds', table: 'lineitem', column: 'shipdate' }]};

				var plan = parser.parse(query);
				expect(plan).to.deep.equal(expected);
			});

			it('should be of type select with two child data sources', function() {
				var parser = new QueryParser(),
					query = 'select shipdate, linenumber from lineitem',
					expected = { type: 'select', filter: [], children: [
						{ type: 'ds', table: 'lineitem', column: 'shipdate' }, 
						{ type: 'ds', table: 'lineitem', column: 'linenumber' }
					]};

				var plan = parser.parse(query);
				expect(plan).to.deep.equal(expected);
			});

			it('should be of type select with one child data source and a GT predicate', function() {
				var parser = new QueryParser(),
					query = 'select shipdate from lineitem where shipdate > 20140518',
					expected = { type: 'select', filter: [], children: [{ type: 'ds', table: 'lineitem', column: 'shipdate', predicate: { value: 20140518, type: 'GT' }}]};

				var plan = parser.parse(query);
				expect(plan).to.deep.equal(expected);
			});

			it('should be of type select with one filter and child data source', function() {
				var parser = new QueryParser(),
					query = 'select linenumber from lineitem where shipdate > 20140518',
					expected = { 
						type: 'select', 
						filter: [{ type: 'ds', table: 'lineitem', column: 'shipdate', predicate: { value: 20140518, type: 'GT' }}], 
						children: [{ type: 'ds', table: 'lineitem', column: 'linenumber'}]
					};

				var plan = parser.parse(query);
				expect(plan).to.deep.equal(expected);
			});

			it('should be of type select with two filters two child data source', function() {
				var parser = new QueryParser(),
					query = 'select linenumber, shipmode from lineitem where supplierkey = 777 and shipdate > 20140518',
					expected = { 
						type: 'select', 
						filter: [{ type: 'and', children: [
							{ type: 'ds', table: 'lineitem', column: 'supplierkey', predicate: { value: 777, type: 'E' }},
							{ type: 'ds', table: 'lineitem', column: 'shipdate', predicate: { value: 20140518, type: 'GT' }}
						]}], 
						children: [
							{ type: 'ds', table: 'lineitem', column: 'linenumber'},
							{ type: 'ds', table: 'lineitem', column: 'shipmode'}
						]
					};

				var plan = parser.parse(query);
				expect(plan).to.deep.equal(expected);
			});

			it('should parse predicate with "or" or "and" in name', function() {
				var parser = new QueryParser(),
					query = 'select orderkey from lineitem where orderkey = 1828',
					expected = { type: 'select', filter: [], children: [{ type: 'ds', table: 'lineitem', column: 'orderkey', predicate: { value: 1828, type: 'E' }}]};

				var plan = parser.parse(query);
				expect(plan).to.deep.equal(expected);
			});

			it('should parse seelct with "count" in column name', function() {
				var parser = new QueryParser(),
					query = 'select discount from lineitem',
					expected = { type: 'select', filter: [], children: [{ type: 'ds', table: 'lineitem', column: 'discount'}]};

				var plan = parser.parse(query);
				expect(plan).to.deep.equal(expected);
			});
			
		});
	});
});
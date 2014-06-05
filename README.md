#![Zeldus](http://rogernoble.github.io/zeldus/images/zeldus.png)
A client side column oriented DBMS.

## Introduction
Zeldus is a browser based database management system that allows for data to be loaded and queried with regular SQL syntax.

## Demo
A simple demo is [available here](http://rogernoble.github.io/zeldus) which demonstrates some of the functionality.

## Usage
To get either:
- Clone the repo: `git clone https://github.com/RogerNoble/zeldus.git`.
- Install with [Bower](http://bower.io): `bower install zeldus`.

To use, include a reference to either `zeldus.js` or `zeldus.min.js` on the page.
Create a new instance of Zeldus. Its constructor accepts a single parameter called dataSource. 
```javascript
db = new Zeldus({
	dataSource: [ new DSLoader('lineitem', 'data/lineitem.json') ]
});
```
The dataSource must be set to an Object that contains a method called `get`. The `get` method must return an array of data Objects. An simple data source loader is included at `/src/utils/dsloader.js`.
Once created Zeldus us ready to execute queries.
```javascript
	zeldus.execute(sqlQuery, callback);
```

## Build
To build first make sure all the dependencies are installed. 
- Install [node.js](http://nodejs.org/)
- From the commandline navigate to the Zeldus directory and run `npm install`

This will install [Gulp](http://gulpjs.com/) which is used to run the build system
To build the source, from the command line run `gulp` this will generate two files `zeldus.js` and `zeldus.min.js`.
To build the documentation, from the command line run `gulp docs` this will generate the documentation in the docs folder.

## Roadmap
- Aggregation operators: `count, sum, min, max`
- Compression
 - [Run Length Encoding](http://en.wikipedia.org/wiki/Run-length_encoding)
- Joins
- Projections

## Reference
Zeldus is heavily based on the c-store architecture as proposed in the following papers.
* **[C-Store: A Column-oriented DBMS](http://db.csail.mit.edu/projects/cstore/vldb.pdf)**
 Mike Stonebraker, Daniel Abadi, Adam Batkin, Xuedong Chen, Mitch Cherniack, Miguel Ferreira, Edmond Lau, Amerson Lin, Sam Madden, Elizabeth O'Neil, Pat O'Neil, Alex Rasin, Nga Tran and Stan Zdonik. VLDB, pages 553-564, 2005
* **[Integrating Compression and Execution in Column-Oriented Database Systems](http://db.csail.mit.edu/projects/cstore/abadisigmod06.pdf)**
 Daniel J. Abadi, Samuel R. Madden, and Miguel C. Ferreira. Proceedings of SIGMOD, June, 2006, Chicago, USA.
* **[query execution in column oriented databases](http://paperhub.s3.amazonaws.com/14d147739ca381a610b8eea771ab0c84.pdf)**
 Abadi, Daniel J. Massachusetts Institute of Technology, 2008
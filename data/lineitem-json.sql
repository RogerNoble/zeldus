  select top 10000
	'{ ' + 
	'"orderkey":' + cast(L_ORDERKEY as varchar(10)) + ', ' + 
	'"partkey":' + cast(L_PARTKEY as varchar(10)) + ', ' + 
	'"supplierkey":' + cast(L_SUPPKEY as varchar(10)) + ', ' + 
	'"linenumber":' + cast(L_LINENUMBER as varchar(10)) + ', ' + 
	'"quantity":' + cast(L_QUANTITY as varchar(10)) + ', ' + 
	'"extendedprice":' + cast(L_EXTENDEDPRICE as varchar(10)) + ', ' + 
	'"discount":' + cast(L_DISCOUNT as varchar(10)) + ', ' + 
	'"tax":' + cast(L_TAX as varchar(10)) + ', ' + 
	'"returnflag":"' + L_RETURNFLAG + '", ' + 
	'"linestatus":"' + L_LINESTATUS + '", ' + 
	'"shipdate":' + convert(varchar(20), L_SHIPDATE, 112) + ', ' + 
	'"commitdate":' + convert(varchar(20), L_COMMITDATE, 112) + ', ' + 
	'"receiptdate":' + convert(varchar(20), L_RECEIPTDATE, 112) + ', ' + 
	'"shipinstruct":"' + L_SHIPINSTRUCT + '", ' + 
	'"shipmode":"' + L_SHIPMODE + '", ' + 
	'"comment":"' + L_COMMENT + '"' +
	' },'
  FROM [tpc-h].[dbo].tmp--[LINEITEM]

with counttest as (
	select top 10000 row_number() over(order by (select 0)) as rownum, * from [tpc-h].[dbo].[LINEITEM]
	--select row_number() over(order by (select 0)) as rownum, * from dbo.tmp
)
  select *--s.L_SHIPMODE, count(*)
  FROM counttest s
  where 
	s.[L_SUPPKEY] = 777
	and convert(varchar(20), s.L_SHIPDATE, 112) > 19961101
  group by s.L_SHIPMODE
  
  
  insert 
  select top 100000 * 
  into tmp
  from [tpc-h].[dbo].[LINEITEM];
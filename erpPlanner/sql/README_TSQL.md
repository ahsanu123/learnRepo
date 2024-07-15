# 🔥 Fundamental TSQL 
Chapter 5

- Exercise 2-1  
Write a query that returns the maximum value in the orderdate column for each employee

```sql
use TSQLV6

SELECT empid, MAX(orderdate) AS maxorderdate
FROM Sales.Orders
GROUP BY empid
ORDER BY empid ;

```
- Exercise 2-2  
Encapsulate the query from Exercise 2-1 in a derived table. Write a Moin query between the derived
table and the Orders table to return the orders with the maximum order date for each employee

```sql
use TSQLV6;

WITH OrderDate_CTE AS 
(
    SELECT empid, MAX(orderdate) AS maxorderdate
    FROM Sales.Orders
    GROUP BY empid
) 
SELECT o.empid, o.maxorderdate as orderdate, orderid, custid
FROM OrderDate_CTE o 
INNER JOIN Sales.Orders s on s.empid = o.empid 
      AND  s.orderdate = o.maxorderdate
``` 

- Exercise 3-1
Write a query that calculates a row number for each order based on orderdate, orderid ordering
```sql
use TSQLV6;

WITH OrderDate_CTE AS 
(
    SELECT orderid, orderdate, custid, empid, ROW_NUMBER() OVER(ORDER BY orderdate, orderid) as num
    FROM Sales.Orders
) 
SELECT * FROM OrderDate_CTE
``` 
- Exercise 3-2
Write a query that returns rows with row numbers 11 through 20 based on the row number definition in
Exercise 3-1. Use a CTE to encapsulate the code from Exercise 3-1
```sql
use TSQLV6;

WITH Orders_CTE AS 
(
    SELECT orderid, orderdate, custid, empid, ROW_NUMBER() OVER(ORDER BY orderdate, orderid ) AS num
    FROM Sales.Orders
)
SELECT * FROM Orders_CTE
ORDER BY num 
OFFSET 10 ROWS 
FETCH FIRST 10 ROWS ONLY 
```

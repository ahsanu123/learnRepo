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
Encapsulate the query from Exercise 1 in a derived table. Write a Moin query between the derived
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

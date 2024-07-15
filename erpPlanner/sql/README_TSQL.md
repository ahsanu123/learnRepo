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

- Exercise 4
  Write a solution using a recursive &TE that returns the management chain leading to 3atricia Doyle
(employee ID 9).You can think of this exercise as the inverse of the request to return an employee and all subordinates in all levels. Here, the anchor member is a query that returns the row for employee 9. The recursive member joins the CTE (call it C)—representing the subordinate/child from the previous level—with the Employees table (call it P)—representing the manager/parent in the next level. This way, each invocation of the recursive member returns the manager from the next level, until no next-level manager is found (in the case of the CEO).

```sql
USE TSQLV6;

WITH RECUR_CTE AS 
(
    SELECT empid, mgrid, firstname, lastname
    FROM HR.Employees 
    WHERE empid = 9

    UNION ALL 

    SELECT P.empid, P.mgrid, P.firstname, P.lastname
    FROM RECUR_CTE AS C 
    INNER JOIN HR.Employees P on P.empid = C.mgrid
)
SELECT * FROM RECUR_CTE
```

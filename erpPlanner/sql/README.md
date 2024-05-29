## Exercise from pgexercises.com

### Basic 
---

How can you retrieve all the information from the cd.facilities table?

```sql
select * from cd.facilities;
```

You want to print out a list of all of the facilities and their cost to members. How would you retrieve a list of only facility names and costs?

```sql
select name, membercost  from cd.facilities;
```

How can you produce a list of facilities that charge a fee to members?

```sql
select * from cd.facilities where membercost > 0;
```

How can you produce a list of facilities that charge a fee to members, and that fee is less than 1/50th of the monthly maintenance cost? Return the facid, facility name, member cost, and monthly maintenance of the facilities in question.

```sql
select facid, name, membercost, monthlymaintenance from cd.facilities where membercost < monthlymaintenance/50 and membercost != 0;
```

How can you produce a list of all facilities with the word 'Tennis' in their name?

```sql
 select * from cd.facilities where name like '%Tennis%';
```

How can you retrieve the details of facilities with ID 1 and 5? Try to do it without using the OR operator.

```sql
select * from cd.facilities where facid in (1,5);
```

How can you produce a list of facilities, with each labelled as 'cheap' or 'expensive' depending on if their monthly maintenance cost is more than $100? Return the name and monthly maintenance of the facilities in question.

```sql
select 
  name, 
  case when(monthlymaintenance > 100) then 'expensive' else 'cheap' end as cost 
from 
  cd.facilities;
```

How can you produce a list of members who joined after the start of September 2012? Return the memid, surname, firstname, and joindate of the members in question.

```sql
select 
  memid, 
  surname, 
  firstname, 
  joindate 
from 
  cd.members 
where 
  extract(
    year 
    from 
      joindate
  ) = 2012 
  and extract(
    month 
    from 
      joindate
  ) > 8;

```

How can you produce an ordered list of the first 10 surnames in the members table? The list must not contain duplicates.

```sql
select 
  distinct surname 
from 
  cd.members 
order by 
  surname asc fetch first 10 rows only;

```

You, for some reason, want a combined list of all surnames and all facility names. Yes, this is a contrived example :-). Produce that list!

```sql
 select surname from cd.members union select name from cd.facilities;
```

You'd like to get the signup date of your last member. How can you retrieve this information?
Schema reminder 

```sql
select max(joindate) as latest from cd.members;
```

You'd like to get the first and last name of the last member(s) who signed up - not just the date. How can you do that?

```sql
select firstname, surname, joindate  from cd.members where joindate = (select max(joindate) from cd.members);
```
<sub>✔️ 29 mei 2024 13:21</sub>
### Join and Subquery 
---



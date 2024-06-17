## Exercise from pgexercises.com
![tableImage](https://pgexercises.com/img/schema-horizontal.svg)
### Basic 
---

<details>
 <summary>Basic Sql</summary>
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
How can you produce a list of the start times for bookings by members named 'David Farrell'?
```sql
select 
  starttime 
from 
  cd.bookings b 
  inner join cd.members m on b.memid = m.memid 
where 
  m.surname = 'Farrell' 
  and m.firstname = 'David';

```

How can you produce a list of the start times for bookings for tennis courts, for the date '2012-09-21'? Return a list of start time and facility name pairings, ordered by the time.
```sql
select 
  b.starttime as start, 
  f.name 
from 
  cd.bookings b 
  inner join cd.facilities f on b.facid = f.facid 
where 
  b.starttime >= '2012-09-21' 
  and b.starttime < '2012-09-22' 
  and f.facid in (0, 1) 
order by 
  b.starttime;

```

How can you output a list of all members who have recommended another member? Ensure that there are no duplicates in the list, and that results are ordered by (surname, firstname).

```sql
select 
  distinct m1.firstname as firstname, 
  m1.surname as surname 
from 
  cd.members m1 
  inner join cd.members m2 on m1.memid = m2.recommendedby 
order by 
  m1.surname;
```

How can you output a list of all members, including the individual who recommended them (if any)? Ensure that results are ordered by (surname, firstname).

```sql
select 
  m1.firstname as memfname, 
  m1.surname as memsname, 
  m2.firstname as recfname, 
  m2.surname recsname 
from 
  cd.members m1 
  left outer join cd.members m2 on m2.memid = m1.recommendedby 
order by 
  memsname, 
  memfname;

```
How can you produce a list of all members who have used a tennis court? Include in your output the name of the court, and the name of the member formatted as a single column. Ensure no duplicate data, and order by the member name followed by the facility name.

```sql
select 
  distinct m.firstname || ' ' || m.surname as member, 
  f.name 
from 
  cd.members m 
  inner join cd.bookings b on m.memid = b.memid 
  inner join cd.facilities f on b.facid = f.facid 
where 
  b.facid in (0, 1) 
order by 
  member, 
  f.name;

```
How can you produce a list of bookings on the day of 2012-09-14 which will cost the member (or guest) more than $30? Remember that guests have different costs to members (the listed costs are per half-hour 'slot'), and the guest user is always ID 0. Include in your output the name of the facility, the name of the member formatted as a single column, and the cost. Order by descending cost, and do not use any subqueries.

```sql
select 
  m.firstname || ' ' || m.surname as member, 
  f.name as facility, 
  case when m.memid = 0 then b.slots * f.guestcost else b.slots * f.membercost end as cost 
from 
  cd.members m 
  inner join cd.bookings b on m.memid = b.memid 
  inner join cd.facilities f on b.facid = f.facid 
where 
  (
    (
      m.memid != 0 
      and b.slots * f.membercost > 30
    ) 
    or (
      m.memid = 0 
      and b.slots * f.guestcost > 30
    )
  ) 
  and b.starttime >= '2012-09-14' 
  and b.starttime < '2012-09-15' 
order by 
  cost desc;

```

How can you output a list of all members, including the individual who recommended them (if any), without using any joins? Ensure that there are no duplicates in the list, and that each firstname + surname pairing is formatted as a column and ordered.

```sql
select 
  distinct m.firstname || ' ' || m.surname as member, 
  (
    select 
      m2.firstname || ' ' || m2.surname 
    from 
      cd.members m2 
    where 
      m2.memid = m.recommendedby
  ) as recby 
from 
  cd.members m 
order by 
  member;

```

The Produce a list of costly bookings exercise contained some messy logic: we had to calculate the booking cost in both the WHERE clause and the CASE statement. Try to simplify this calculation using subqueries. For reference, the question was:

_How can you produce a list of bookings on the day of 2012-09-14 which will cost the member (or guest) more than $30? Remember that guests have different costs to members (the listed costs are per half-hour 'slot'), and the guest user is always ID 0. Include in your output the name of the facility, the name of the member formatted as a single column, and the cost. Order by descending cost._

```sql
select 
  member, 
  facility, 
  cost 
from 
  (
    select 
      m.firstname || ' ' || m.surname as member, 
      f.name as facility, 
      case when m.memid = 0 then f.guestcost * b.slots else f.membercost * b.slots end as cost 
    from 
      cd.members m 
      inner join cd.bookings b on m.memid = b.memid 
      inner join cd.facilities f on b.facid = f.facid 
    where 
      b.starttime >= '2012-09-14' 
      and b.starttime < '2012-09-15'
  ) as bookings 
where 
  cost > 30 
order by 
  cost desc;

```

</details>
<sub>✔️ 29 mei 2024 15:20</sub>

### Modifying data 
--- 

<details>
 <summary>Modifying data sql</summary>
 The club is adding a new facility - a spa. We need to add it into the facilities table. Use the following values:
facid: 9, Name: 'Spa', membercost: 20, guestcost: 30, initialoutlay: 100000, monthlymaintenance: 800.
```sql
insert into cd.facilities (
  facid, name, membercost, guestcost, 
  initialoutlay, monthlymaintenance
) 
values 
  (9, 'Spa', 20, 30, 100000, 800);

```

In the previous exercise, you learned how to add a facility. Now you're going to add multiple facilities in one command. Use the following values:
facid: 9, Name: 'Spa', membercost: 20, guestcost: 30, initialoutlay: 100000, monthlymaintenance: 800.
facid: 10, Name: 'Squash Court 2', membercost: 3.5, guestcost: 17.5, initialoutlay: 5000, monthlymaintenance: 80.
```sql
insert into cd.facilities (
  facid, name, membercost, guestcost, 
  initialoutlay, monthlymaintenance
) 
values 
  (9, 'Spa', 20, 30, 100000, 800), 
  (10, 'Squash Court 2', 3.5, 17.5, 5000, 80);
```

Let's try adding the spa to the facilities table again. This time, though, we want to automatically generate the value for the next facid, rather than specifying it as a constant. Use the following values for everything else:
Name: 'Spa', membercost: 20, guestcost: 30, initialoutlay: 100000, monthlymaintenance: 800.

```sql
insert into cd.facilities (
  facid, name, membercost, guestcost, 
  initialoutlay, monthlymaintenance
) values((select max(facid) from cd.facilities)+1, 'Spa', 20, 30, 100000, 800);
```

We made a mistake when entering the data for the second tennis court. The initial outlay was 10000 rather than 8000: you need to alter the data to fix the error.

```sql
update cd.facilities set initialoutlay=10000 where facid=1;
```

We want to increase the price of the tennis courts for both members and guests. Update the costs to be 6 for members, and 30 for guests.
```sql
update cd.facilities set membercost=6, guestcost=30 where facid in (0,1);
```

We want to alter the price of the second tennis court so that it costs 10% more than the first one. Try to do this without using constant values for the prices, so that we can reuse the statement if we want to.

```sql
update 
  cd.facilities 
set 
  membercost = m.membercost * 1.1, 
  guestcost = m.guestcost * 1.1 
from 
  (
    select 
      membercost, 
      guestcost 
    from 
      cd.facilities 
    where 
      facid = 1
  ) m 
where 
  facid = 1;

```

As part of a clearout of our database, we want to delete all bookings from the cd.bookings table. How can we accomplish this?

```sql
delete from cd.bookings;
```

We want to remove member 37, who has never made a booking, from our database. How can we achieve that?

```sql
delete from cd.members where memid=37;
```

In our previous exercises, we deleted a specific member who had never made a booking. How can we make that more general, to delete all members who have never made a booking?

```sql
delete from 
  cd.members 
where 
  memid not in (
    select 
      distinct memid 
    from 
      cd.bookings b
  )

```

</details>
<sub>✔️ 18 juni 2024 04:05</sub>


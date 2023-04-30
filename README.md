# FutureForms

A Typescript library for fast and easy development of data entry forms.

Turn a HTML table into a database view, search and edit form with a few edits.

Try the [FutureForms Featured Demo](https://github.com/peter-gram/ff-install)

## Stack

A normal Full-stack development consist of af front-end, a back-end and a database.
In FutureForms this is cut down to a front-end, a generic back-end and a database.

Here the sketch shows the Javascript application running in the client browser
and then sending SQL to the `database.js` back-end.
The `database.js` converts the SQL to the appropriate database driver
and sends the result back to the client.

![Figure: Building Blocks](images/blocks.svg)

## Security

FutureForms is primarily ment to be used for intra-net.
SQL-statements are written in the Javascript application
and then passed through the back-end directly to the database.

It is therefore necessary to protect with `GRANT` and other
security technics.

![Figure: Compare Business Logic](images/compare-business-logic.svg)

`database.js` can be configured to reject known keywords like
`CREATE`, `DROP` and `TRUNCATE` but it recommended to handle
the security in the database with `GRANT`.

### Exploits of a Mom

In a standard full-stack setup you have the risk of a SQL-injection.
With FutureForms any SQL-statements are passed through even
the infamous `"Robert'); DROP TABLE Sudents"` so you have
to protect your database for this kind of statements.

![Figure: Exploits of a Mom](images/exploits_of_a_mom.png)

© 2010 [xkcd.org](https://xkcd.com/327/) 

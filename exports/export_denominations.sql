-- The following command exports the denominations table to a csv file
COPY (SELECT * FROM relcensus.denominations) TO 'exports/denominations.csv' WITH (FORMAT csv, HEADER true);

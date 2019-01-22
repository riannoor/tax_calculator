const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

/**
 * run migrations and seeds
 */

const up = () => {
  /** created tables */
  const queryText =`
    CREATE TABLE IF NOT EXISTS
    master_tax_codes(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS
    bills(
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    ); 
    CREATE TABLE IF NOT EXISTS
    items(
      id SERIAL PRIMARY KEY,
      tax_code_id SERIAL REFERENCES master_tax_codes(id) ON DELETE CASCADE ON UPDATE CASCADE,
      bill_id SERIAL REFERENCES bills(id) ON DELETE CASCADE ON UPDATE CASCADE,
      name VARCHAR(255) NOT NULL,
      price INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
  `;

  pool.query(queryText).then((res) => {
    console.log(res);
    //insert seeds when tables is created
    insertSeeds();
  })
  .catch((err) => {
    console.log(err);
  });
}

/**
 * Seeds table
 */
const insertSeeds = () => {
  const queryText = `
    INSERT INTO master_tax_codes (name)
    VALUES
    ('Food & Beverage'),
    ('Tobacco'),
    ('Entertainment')`;   

  pool.query(queryText).then((res) => {
    console.log(res);
    pool.end();
  })
  .catch((err) => {
    console.log(err);
    pool.end();
  });
}

/**
 * Drop Tables
 */
const down = () => {
  const queryText = 'DROP TABLE IF EXISTS master_tax_codes, bills, items';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  down,
  up
};

require('make-runnable');
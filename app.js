/** Simple demo Express app. */

const express = require("express");
const app = express();

// useful error class to throw
const { NotFoundError, BadRequestError } = require("./expressError");

const MISSING = "Expected key `nums` with comma-separated list of numbers.";


/** Finds mean of nums in qs: returns {operation: "mean", result } */
app.get("/mean", function (req, res) {
  if (!req.query.nums) {
    throw new BadRequestError("Nums are required.");
  }
  const numsList = (req.query.nums).split(",").map(num => Number(num));
  const sum = numsList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const mean = sum/numsList.length;
  return res.json({
    operation: "mean",
    value: mean
  })
})

/** Finds median of nums in qs: returns {operation: "median", result } */

app.get("/median", function (req, res) {
  if (!req.query.nums) {
    throw new BadRequestError("Nums are required.");
  }

  const numsList = (req.query.nums).split(",").map(num => Number(num)).sort();
  let median;

  if (numsList.length % 2 !== 0) {
    const middleIndex = Math.floor(numsList.length/2);
    median = numsList[middleIndex];
  } else {
    const firstMiddle = numsList.length/2 - 1;
    const secondMiddle = numsList.length/2;
    median = (numsList[firstMiddle] + numsList[secondMiddle]) / 2;
  }

  return res.json({
    operation: "median",
    value: median
  })
})


/** Finds mode of nums in qs: returns {operation: "mean", result } */


/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res) {
  throw new NotFoundError();
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});



module.exports = app;
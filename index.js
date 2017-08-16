/**
 * amortization table calculations
 * ===============================
 * calculates the monthly payment
 * calculates remaining loan balance
 * calculates sum of interest payments
 * calculates sum of principal payments
 * @param {number} amount
 * @param {number} rate
 * @param {number} totalTerm
 * @param {number} amortizeTerm
 * @param {number} principalPayment
 * @returns {object}
 */
var amortizationCalc = function(amount, rate, totalTerm, amortizeTerm, principalPayment) {
  var periodInt,
      monthlyPayment,
      summedInterest = 0,
      summedPrincipal = 0,
      monthlyIntPaid,
      monthlyPrincPaid,
      summedAmortize = {},
      principalPayment = (!!principalPayment) ? parseInt(principalPayment,10) : 0;

  // Calculate monthly interest rate and monthly payment
  periodInt = (rate / 12) / 100;
  monthlyPayment = amount * (periodInt / (1 - Math.pow(1 + periodInt, -(totalTerm))));
  // If zero or NaN is returned (i.e. if the rate is 0) calculate the payment without interest
  monthlyPayment = monthlyPayment || amount / totalTerm;

  // Calculate the interest, principal, and remaining balance for each period
  var i = 0;
  while( i < amortizeTerm) {
    if(amount < 0)
      break;
    monthlyIntPaid = amount * periodInt;
    monthlyPrincPaid = monthlyPayment - monthlyIntPaid + principalPayment;
    summedInterest = summedInterest + monthlyIntPaid;
    summedPrincipal = summedPrincipal + monthlyPrincPaid;
    amount = amount - monthlyPrincPaid;
    i += 1;
  }

  summedAmortize.termsSaved = amortizeTerm - i;
  summedAmortize.principalPaymentsTotal = i * principalPayment;
  summedAmortize.interest = summedInterest;
  summedAmortize.principal = summedPrincipal;
  summedAmortize.balance = amount;
  summedAmortize.payment = monthlyPayment + principalPayment;
  summedAmortize.monthlyInterest = monthlyIntPaid;
  summedAmortize.monthlyPrincipal = monthlyPrincipalPaid

  return summedAmortize;

};

/**
 * Throw an error if a string or number below 0 is passed
 * @param {object}
 * @returns {object}
 */
var errorCheck = function(opts) {
  for (var key in opts) {
    if (opts.hasOwnProperty(key)) {
      if (typeof opts[key] === 'undefined' || isNaN(parseFloat(opts[key])) || opts[key] < 0) {
        throw new Error('Loan ' + key + ' must be a non-negative value.');
      }
    }
  }
};

/**
 * Round values to two decimal places
 * @param {object}
 * @returns {object}
 */
var roundNum = function(numObj) {
  var tmp = {};
  for (var property in numObj) {
    tmp[property] = numObj[property];
    tmp[property + 'Round'] = (Math.round(numObj[property] * 100) / 100).toFixed(2);
  }
  return tmp;
};

/**
 * Pass values and return output
 * @param {object} amount, rate, totalTerm, amortizeTerm
 * @example amortize({amount: 180000, rate: 4.25, totalTerm: 360, amortizeTerm: 60, principalPayment: 200})
 * @returns {object}
 */
var amortize = function(opts) {
  errorCheck(opts);
  var amortized = amortizationCalc(opts.amount, opts.rate, opts.totalTerm, opts.amortizeTerm, opts.principalPayment);
  return roundNum(amortized);
};

module.exports = amortize;

import unformat from "./unformat";
import formatNumber from "./format-number";
import { currency } from "./settings";
import { defaults, checkPrecision, isObject, checkCurrencyFormat } from "./utils";

/**
 * Format a number into currency
 *
 * Usage: accounting.formatMoney(number, symbol, precision, thousandsSep, decimalSep, format)
 * defaults: (0, "$", 2, ",", ".", "%s%v")
 *
 * Localise by overriding the symbol, precision, thousand / decimal separators and format
 * Second param can be an object matching `settings.currency` which is the easiest way.
 *
 * To do: tidy up the parameters
 *
 * @method formatMoney
 * @for accounting
 * @param number {Number} The number to be formatted.
 * @param symbol {Object|String} String with the currency symbol or an object of options that
 *                                contains the items of the signature except the number, for convenience.
 * @param precision
 * @param thousand
 * @param decimal
 * @param format
 * @return {String} The given number properly formatted as money.
 */
function formatMoney(number, symbol, precision, thousand, decimal, format) {
  // Resursively format arrays:
  if (Array.isArray(number)) {
    return number.map(function(val){
      return formatMoney(val, symbol, precision, thousand, decimal, format);
    });
  }

  // Clean up number:
  number = unformat(number);

  // Build options object from second param (if object) or all params, extending defaults:
  var opts = defaults(
      (isObject(symbol) ? symbol : {
        symbol : symbol,
        precision : precision,
        thousand : thousand,
        decimal : decimal,
        format : format
      }),
      currency
    );

  // Check format (returns object with pos, neg and zero):
  var formats = checkCurrencyFormat(opts.format);

  // Choose which format to use for this value:
  var useFormat = number > 0 ? formats.pos : number < 0 ? formats.neg : formats.zero;

  // Return with currency symbol added:
  return useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(number), checkPrecision(opts.precision), opts.thousand, opts.decimal));
}

export default formatMoney;

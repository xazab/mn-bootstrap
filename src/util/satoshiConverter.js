const SATOSHI_MULTIPLIER = 10 ** 8;

/**
 * Convert satoshis to Xazab
 *
 * @param {number} satoshi
 *
 * @returns {number}
 */
function toXazab(satoshi) {
  return satoshi / SATOSHI_MULTIPLIER;
}

/**
 * Convert Xazab to satoshis
 *
 * @param {number} Xazab
 *
 * @return {number}
 */
function toSatoshi(xazab) {
  return xazab * SATOSHI_MULTIPLIER;
}

module.exports = {
  toXazab,
  toSatoshi,
};

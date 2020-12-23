const { client: JsonRpcClient } = require('jayson/promise');

/**
 * Create Tenderxazab RPC client
 *
 * @param {Object} [options]
 * @param {string} [options.host]
 * @param {number} [options.port]
 */
function createTenderxazabRpcClient({ host, port } = {}) {
  return JsonRpcClient.http({
    host: host || '127.0.0.1',
    port: port || 26657,
  });
}

module.exports = createTenderxazabRpcClient;

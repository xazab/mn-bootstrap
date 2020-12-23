const RpcClient = require('@xazab/xazabd-rpc/promise');

/**
 * Create Core JSON RPC Client
 *
 * @typedef createRpcClient
 * @param {Object} [config]
 * @param {string} [config.protocol=http]
 * @param {string} [config.user=xazabrpc]
 * @param {string} [config.pass=password]
 * @param {string} [config.host=127.0.0.1]
 * @param {number} [config.port=20002]
 * @return {RpcClient|PromisifyModule}
 */
function createRpcClient(config = {}) {
  // eslint-disable-next-line no-param-reassign
  config = {
    protocol: 'http',
    user: 'xazabrpc',
    pass: 'password',
    host: '127.0.0.1',
    port: 20002,
    ...config,
  };

  return new RpcClient(config);
}

module.exports = createRpcClient;

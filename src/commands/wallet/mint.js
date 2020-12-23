const { Listr } = require('listr2');

const { flags: flagTypes } = require('@oclif/command');

const BaseCommand = require('../../oclif/command/BaseCommand');
const MuteOneLineError = require('../../oclif/errors/MuteOneLineError');

const NETWORKS = require('../../networks');

class MintCommand extends BaseCommand {
  /**
   * @param {Object} args
   * @param {Object} flags
   * @param {generateToAddressTask} generateToAddressTask
   * @param {Config} config
   * @return {Promise<void>}
   */
  async runWithDependencies(
    {
      amount,
    },
    {
      address,
    },
    generateToAddressTask,
    config,
  ) {
    const network = config.get('network');

    if (network !== NETWORKS.LOCAL) {
      throw new Error('Only local network supports generation of xazab');
    }

    const tasks = new Listr([
      {
        title: `Generate ${amount} xazab to address`,
        task: () => generateToAddressTask(config, amount),
      },
    ],
    {
      rendererOptions: {
        clearOutput: false,
        collapse: false,
        showSubtasks: true,
      },
    });

    try {
      await tasks.run({
        address,
        network,
      });
    } catch (e) {
      throw new MuteOneLineError(e);
    }
  }
}

MintCommand.description = `Mint xazab
...
Mint specified amount of xazab to a new address or specified one
`;

MintCommand.flags = {
  ...BaseCommand.flags,
  address: flagTypes.string({ char: 'a', description: 'recipient address instead of a new one', default: null }),
};

MintCommand.args = [{
  name: 'amount',
  required: true,
  description: 'amount of xazab to be generated to address',
  parse: (input) => parseInt(input, 10),
}];

module.exports = MintCommand;

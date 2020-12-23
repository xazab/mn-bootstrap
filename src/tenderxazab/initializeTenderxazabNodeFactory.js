const { WritableStream } = require('memory-streams');

/**
 *
 * @param {DockerCompose} dockerCompose
 * @param {Docker} docker
 * @param {dockerPull} dockerPull
 * @return {initializeTenderxazabNode}
 */
function initializeTenderxazabNodeFactory(dockerCompose, docker, dockerPull) {
  /**
   * @typedef {initializeTenderxazabNode}
   * @param {Config} config
   * @return {Promise<Object>}
   */
  async function initializeTenderxazabNode(config) {
    if (await dockerCompose.isServiceRunning(config.toEnvs(), 'drive_tenderxazab')) {
      throw new Error('Can\'t initialize Tenderxazab. Already running.');
    }

    const { COMPOSE_PROJECT_NAME: composeProjectName } = config.toEnvs();
    const volumeName = 'drive_tenderxazab';
    const volumeNameFullName = `${composeProjectName}_${volumeName}`;

    const volume = docker.getVolume(volumeNameFullName);

    const isVolumeDefined = await volume.inspect()
      .then(() => true)
      .catch(() => false);

    if (!isVolumeDefined) {
      // Create volume with tenderxazab data
      await docker.createVolume({
        Name: volumeNameFullName,
        Labels: {
          'com.docker.compose.project': composeProjectName,
          'com.docker.compose.version': '1.27.4',
          'com.docker.compose.volume': volumeName,
        },
      });
    }

    // Initialize Tenderxazab

    const tenderxazabImage = config.get('platform.drive.tenderxazab.docker.image', true);

    await dockerPull(tenderxazabImage);

    const writableStream = new WritableStream();

    const command = [
      '/usr/bin/tenderxazab init > /dev/null',
      'echo "["',
      'cat $TMHOME/config/priv_validator_key.json',
      'echo ","',
      'cat $TMHOME/config/node_key.json',
      'echo ","',
      'cat $TMHOME/config/genesis.json',
      'echo "]"',
      'rm -rf $TMHOME/config',
    ].join('&&');

    const [result] = await docker.run(
      tenderxazabImage,
      [],
      writableStream,
      {
        Entrypoint: ['sh', '-c', command],
        HostConfig: {
          AutoRemove: true,
          Binds: [`${volumeNameFullName}:/tenderxazab`],
        },
      },
    );

    if (result.StatusCode !== 0) {
      let message = writableStream.toString();

      if (result.StatusCode === 1 && message === '') {
        message = 'already initialized. Please reset node data';
      }

      throw new Error(`Can't initialize tenderxazab: ${message}`);
    }

    return JSON.parse(writableStream.toString());
  }

  return initializeTenderxazabNode;
}

module.exports = initializeTenderxazabNodeFactory;

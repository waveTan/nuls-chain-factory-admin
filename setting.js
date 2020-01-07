const env = process.env.NULS_ENV;
let config = {};
switch (env) {
  case 'development':
    config = {
      API_ROOT: '/dev',//'/dev',/api
      API_URL: 'http://192.168.1.130:18003',
      API_TIME: 9000,
      API_CHAIN_ID: 2,
      API_PREFIX: 'tNULS',
    };
    break;
  case 'beta':
    config = {
      API_ROOT: '',
      API_URL: 'http://beta.public1.nuls.io',
      API_TIME: 9000,
      API_CHAIN_ID: 2,
      API_PREFIX: 'tNULS',
    };
    break;
  case 'production':
    config = {
      API_ROOT: '',
      API_URL: 'https://public1.nuls.io',
      API_TIME: 8000,
      API_CHAIN_ID: 1,
      API_PREFIX: 'NULS',
    };
    break;
}
export default config

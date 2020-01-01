const apiEnv = 'dev'; // dev beta prod

export const ENV = {
  prod: {
    host: 'm.xxx.com',
    baseUrl: 'https://m.xxx.com',
    apiBaseUrl: 'https://m.api.xxx.com',
  },
  dev: {
    baseUrl: 'https://m.dev.xxx.com',
    apiBaseUrl: 'https://m.devapi.xxx.com',
  },
  beta: {
    baseUrl: 'https://m.beta.xxx.com',
    apiBaseUrl: 'https://m.betaapi.xxx.com',
  }
};

const baseEnv = {
  port: 8001,
  debug: false,
  publicPath: '',
  baseUrl: '',
  apiBaseUrl: '',
};

function createEnv(opts = {}) {
  const { env = 'prod' } = opts;
  return Object.assign({}, baseEnv, ENV[env], opts);
}

// 默认会有个 api 配置，之后会读取 store
const mini = createEnv({
  env: apiEnv,
});

module.exports = mini;

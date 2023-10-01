// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: './.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF = 'origin/main',
  DEPLOY_REPO,
} = process.env;

module.exports = {
  apps: [
    {
      name: 'backend',
      script: './dist/main.js',
      watch: '.',
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      'pre-deploy-local': `scp ./.env.deploy ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}`,
      'post-deploy': `cd ${DEPLOY_PATH}/source/backend && npm i && npm run build`,
    },
  },
};

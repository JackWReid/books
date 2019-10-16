module.exports = {
  apps : [
    {
      name: 'buukks-backend',
      script: './build/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '200M',
      env_production : {
        NODE_ENV: 'production',
        DB_HOST: 'localhost',
        DB_USER: 'postgres',
        DB_PASS: 'postgres',
      }
    },
  ],

  deploy : {
    production : {
      'user': 'root',
      'host': 'api.buukks.xyz',
      'ref': 'origin/master',
      'repo': 'git@github.com:JackWReid/buukks-backend.git',
      'path': '/root',
      'post-deploy': 'yarn && npm run build && pm2 startOrRestart ecosystem.config.js --env production',
    },
  }
};

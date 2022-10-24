import * as winstonServer from 'winston-dashboard';

const log = () =>
  winstonServer({
    path: './logs',
    logFiles: '/**/*.log',
    port: 8000,
    orderBy: 'creationTime',
  });

export default log;

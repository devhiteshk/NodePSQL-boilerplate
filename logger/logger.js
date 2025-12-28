const formatTimestamp = () => {
  const now = new Date();
  return now.toISOString();
};

const log = async (prefix, color, ...params) => {
  const chalk = (await import('chalk')).default;
  console.log(chalk[color](`${formatTimestamp()} ${prefix}`), ...params);
};

const info = (...params) => {
  log('✅ INFO:', 'green', ...params);
};

const error = (...params) => {
  log('🔴 ERROR:', 'red', ...params);
};

const warn = (...params) => {
  log('🟡 WARN:', 'yellow', ...params);
};

const debug = (...params) => {
  if (process.env.DEBUG === 'true') {
    log('🐛 DEBUG:', 'blue', ...params);
  }
};

const success = (...params) => {
  log('🎉 SUCCESS:', 'magenta', ...params);
};

const custom = (prefix, color, ...params) => {
  log(`${prefix}:`, color, ...params);
};

export { info, error, warn, debug, success, custom };

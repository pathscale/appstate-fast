module.exports = api => {
  api.cache.invalidate(() => process.env.NODE_ENV === 'production')
  const presets = [['@babel/preset-env', { modules: false }]]
  return { presets }
}

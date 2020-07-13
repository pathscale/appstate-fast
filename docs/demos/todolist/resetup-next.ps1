ncu -u --dep 'prod,dev' --concurrency 16
ncu -u --dep 'prod,dev' --concurrency 16 -n -f '@ant-design-vue/babel-plugin-jsx,@vue/composition-api,@vue/compiler-sfc,@vue/runtime-dom,vue,vue-router,vuex,rollup-plugin-vue'
sort-package-json
wsl rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml
npm i

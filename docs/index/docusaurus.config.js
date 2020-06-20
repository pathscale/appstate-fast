module.exports = {
  title: 'Appstate-fast',
  tagline: 'The simple but incredibly fast and flexible state management that is based on React state hook',
  url: 'https://vue3.dev',
  baseUrl: '/',
  favicon: 'img/favicon-32.png',
  projectName: 'pathscale/appstate-fast', // Usually your repo name.
  themeConfig: {
    disableDarkMode: true,
    navbar: {
      title: 'Appstate-fast',
      logo: {
        alt: 'Appstate-fast',
        src: 'img/favicon-196.png',
      },
      links: [
        {to: 'docs/getting-started', label: 'Docs', position: 'left'},
        {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/pathscale/appstate-fast',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting started',
              to: 'https://vue3.dev/docs/getting-started',
            },
            {
              label: 'API reference',
              to: 'https://vue3.dev/docs/typedoc-appstate-fast-core',
            },
          ],
        },
        {
          title: 'Extensions',
          items: [
            {
              label: 'Standard plugins',
              href: 'https://vue3.dev/docs/extensions-overview',
            },
            {
              label: 'Development tools',
              href: 'https://vue3.dev/docs/devtools',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Blog',
              href: 'https://vue3.dev/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/pathscale/appstate-fast',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/pathscale/appstate-fast/issues?q=is%3Aissue+is%3Aopen+label%3Aquestion',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Appstate-fast.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/pathscale/appstate-fast/edit/master/docs/index',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ]
};

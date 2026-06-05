/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: "src/**/*.stories.{js,jsx,ts,tsx}",
  defaultStory: "core-ui--card--default",
  appendToHead: `
    <meta name="theme-color" content="#f5f1eb" />
  `,
  addons: {
    a11y: { enabled: true },
    theme: { enabled: false },
    rtl: { enabled: false },
    source: { enabled: true },
  },
}

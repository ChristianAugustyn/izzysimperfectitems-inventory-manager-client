module.exports = {
    content: [
      "./src/**/*.{js,jsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [
        require('daisyui')
    ],
    daisyui: {
        styled: true,
        base: true,
        utils: true,
        logs: true,
        rtl: false,
        themes: false
        // [
        //     'light', // first one will be the default theme
        //     'dark'
        // ]
    }
  }
const { iconsPlugin, getIconCollections } = require("@egoist/tailwindcss-icons")

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'cursive': ['Licorice', 'cursive'],
                'display': ['Staatliches', 'system-ui', 'sans-serif'],
            },
            colors: {
                'button': '#40798C',
                'verdigris': '#70A9A1',
                'ash': '#CFD7C7',
            },
        },
    },
    plugins: [
        iconsPlugin({
            collections: getIconCollections(['lucide']),
        }),
    ],
}


/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'cursive': ['Coming Soon', 'cursive'],
                'display': ['Staatliches', 'system-ui', 'sans-serif'],
            },
            colors: {
                'button': '#40798C',
            },
        },
    },
    plugins: [],
}


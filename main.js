import './style.css'

window.onload = function() {
    const text = document.getElementById('text');

    let values = [];
    let start = null;

    text.addEventListener('input', () => {
        if (!start) {
            start = new Date();
        }

        values.push({
            value: text.value,
            time: new Date() - start,
        });
    });

    const reproduceText = (element) => {
        element.textContent = '';
        const printingStart = new Date();

        setInterval(() => {
            const timePassed = new Date() - printingStart;

            const value = values.filter((value) => value.time < timePassed).pop();

            if (value) {
                element.textContent = value.value;
            }
        }, 50);
    };

    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const results = document.getElementById('results');
        reproduceText(results);
    });
};

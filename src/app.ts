document.addEventListener("DOMContentLoaded", function (ev: Event): any {
    const btn = document.getElementById('test') as HTMLButtonElement;
    btn.addEventListener('click', (ev) => {
        alert('Hello World!');
        ev.stopPropagation();
    });
});
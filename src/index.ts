import './styles.sass';

document.addEventListener('DOMContentLoaded', function(ev: Event): void {
    const btn = document.getElementById('test') as HTMLButtonElement;
    btn.addEventListener('click', (evt) => {
        alert('Hello World!');
        evt.stopPropagation();
        console.log('test');
    });
});

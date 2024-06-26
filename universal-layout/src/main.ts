const $menuItems = document.querySelectorAll('.menu__item');

$menuItems.forEach(item => {
    item.addEventListener('click', () => {
        $menuItems.forEach(item => item.classList.remove('on'));
        item.classList.add('on');
    })
})
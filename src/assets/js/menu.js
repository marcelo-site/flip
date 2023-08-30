const menu = document.querySelectorAll('nav ul li i:not(.bi-whatsapp)')
const menuIsactive = () => {
    menu.forEach(el => {
        el.addEventListener('click',evt => {
            menu.forEach(men => men.classList.remove('current'))
            el.classList.add('current')
        })
    })
}

export { menuIsactive }
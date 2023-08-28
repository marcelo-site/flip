const flip = document.querySelectorAll('.flip')
const fronts = document.querySelectorAll('.front .btn')
const versos = document.querySelectorAll('.verso .virate .btn')
const divVersos = document.querySelectorAll('.verso-products')
const bulets = document.querySelectorAll('.bulets span')
const divBultests = document.querySelectorAll('.bulets')
let width = window.innerWidth

divVersos.forEach((gridProduct, i) => {
    const count = divVersos[i].querySelectorAll('.info').length
    gridProduct.style.gridTemplateColumns =`repeat(${count}, 1fr)`;
})

versos.forEach((el, i) => {
    el.addEventListener('click', () => flip[i].style.transform = '')
})

fronts.forEach((el, i) => {
    el.addEventListener('click', () => {
        flip[i].style.transform = 'rotateY(180deg)'
        changeCarrosel()
    })
})

divVersos.forEach((verso, i) => divBultests[i].setAttribute('data-index-products', i))

const changeCarrosel = () => {
    bulets.forEach((bulet, i) => {
        bulet.addEventListener('click', (el) => {
            const parent = bulet.parentNode
            const index = parent.getAttribute('data-index-products')
            const lengthBuletAtual = parent.querySelectorAll('span')
            lengthBuletAtual.forEach((elem, ind) => {
                elem.addEventListener('click', () => {
                    divVersos[index].scrollLeft = width * ind + 20
                })
            })
        })
    })
}

window.addEventListener('load', () => {
    changeCarrosel()
    const container = document.querySelectorAll('.container')
    const sizeImg = document.querySelector('.container img')
    container.forEach(el => {
        el.style.height = `${sizeImg.clientHeight + 180}px`
    })
} )

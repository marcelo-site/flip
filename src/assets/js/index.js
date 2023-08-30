const flip = document.querySelectorAll('.flip')
const fronts = document.querySelectorAll('.front .btn')
const versos = document.querySelectorAll('.verso .virate .btn')
const divVersos = document.querySelectorAll('.verso-products')
const bulets = document.querySelectorAll('.bulets span')
const divBultests = document.querySelectorAll('.bulets')
const labels = document.querySelectorAll('form .info .sizes label')
const inputsSize = document.querySelectorAll('form .info input[type="radio"]')
const forms = document.querySelectorAll('.verso-products form')
let width = window.innerWidth
const msg = document.querySelector('#msg')
const cartQty = document.querySelector('#cart-qty')
import { menuIsactive } from "./menu.js"

if(!localStorage.hasOwnProperty('cart')) {
    localStorage.setItem('cart', JSON.stringify([]))
}

const markBuletPosition = (paramPositon) => {
    const bulets = divBultests[paramPositon].querySelectorAll('span div')
    bulets.forEach(bulet => bulet.style.backgroundColor = '')
    const position = divVersos[paramPositon].scrollLeft / (width * 0.88)
    bulets[parseInt(position)].style.backgroundColor = 'blue'
}

divVersos.forEach((el, i)=> el.addEventListener('scroll', () => markBuletPosition(i)))
const orderExists = JSON.parse(localStorage.getItem('cart'))

inputsSize.forEach((size, i) => {
    size.addEventListener('click', () => {
        labels.forEach(label => label.classList.remove('checked'))
        if (size.checked) {
            labels[i].classList.add('checked')
        }
    })
})

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        const div = document.createElement('div')
        div.classList.add('message')
        try {
            e.preventDefault()
            const sizeInput = e.target.size
            const size = sizeInput.value
            const desc = Array.from(sizeInput).filter(el => el.checked)
            if (desc.length === 0) {
                throw new Error('Escolha um tamanho!')
            }
            const exists = orderExists.filter(order => order.desc === desc[0].id)
            if(exists.length !== 0) {
                throw new Error('Você já adicionou este item no carrinho!')
            }
            const img = e.target.img.src
            const price = e.target.price.value
            const qty = e.target.qty.value
            const order = {
                img, price, size, qty, desc: desc[0].id
            }
            if(orderExists) {
                orderExists.push(order)
                localStorage.setItem('cart', JSON.stringify(orderExists))
            } else {
                localStorage.setItem('cart', JSON.stringify([order]))
            }
            div.innerHTML = 'Você adicionou um item no carrinho!'
            div.classList.add('sucess')
            msg.append(div)
            const cartQtyTot = parseInt(cartQty.innerHTML)
            cartQty.innerHTML = cartQtyTot + 1
        } catch (error) {
            div.innerHTML = error.message
            div.classList.add('alert')
            msg.append(div)
        } finally {
            setTimeout(() => msg.removeChild(div), 3000)
        }
    })
})

divVersos.forEach((gridProduct, i) => {
    const count = divVersos[i].querySelectorAll('.info').length
    gridProduct.style.gridTemplateColumns = `repeat(${count}, 1fr)`;
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
    if(orderExists.length > 0) {
        cartQty.innerHTML= orderExists.length
    }
    changeCarrosel()
    const container = document.querySelectorAll('.container')
    const sizeImg = document.querySelector('.container img')
    container.forEach(el => {
        el.style.height = `${sizeImg.clientHeight + 220}px`
    })
    menuIsactive()
})

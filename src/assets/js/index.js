const container = document.querySelectorAll('.container')
const flip = document.querySelectorAll('.flip')
const fronts = document.querySelectorAll('.front .btn')
const versos = document.querySelectorAll('.verso .virate .btn')
const divVersos = document.querySelectorAll('.verso-products')
const divBultests = document.querySelectorAll('.bulets')
const labels = document.querySelectorAll('form .info .sizes label')
const inputsSize = document.querySelectorAll('form .info input[type="radio"]')
const forms = document.querySelectorAll('.verso-products form')
let width = window.innerWidth
const msg = document.querySelector('#msg')
const cartQty = document.querySelector('#cart-qty')
const left = document.querySelectorAll('.left')
const rigth = document.querySelectorAll('.right')
const containerImg = document.querySelectorAll('.container-img')
import { menuIsactive } from "./menu.js"

if (!localStorage.hasOwnProperty('cart')) {
    localStorage.setItem('cart', JSON.stringify([]))
}
const orderExists = JSON.parse(localStorage.getItem('cart'))

const changeVisibleImg = (paramLeft, paramRigth, paramImgs, paramIndexImg, paramIndex) => {
    paramLeft.forEach(elLeft => elLeft.style.backgroundColor = '')
    if (paramIndexImg === 0) paramLeft[paramIndex].style.backgroundColor = '#706f6f'

    paramRigth.forEach(elRigth => elRigth.style.backgroundColor = '')
    if (paramIndexImg === paramImgs.length - 1) paramRigth[paramIndex].style.backgroundColor = '#706f6f'
    
    paramImgs.forEach(img => img.style.display = 'none')
    paramImgs[paramIndexImg].style.display = ''
}

containerImg.forEach((el, i) => {
    let indexImg = 0
    const imgs = el.querySelectorAll('img')

    left[i].addEventListener('click', () => {
        if (indexImg > 0 && indexImg < imgs.length) {
            indexImg--
            changeVisibleImg(left, rigth, imgs, indexImg, i)
        }
    })
    rigth[i].addEventListener('click', (elRight) => {
        if (indexImg >= 0 && indexImg < imgs.length - 1) {
            indexImg++
            changeVisibleImg(left, rigth, imgs, indexImg, i)
        }
    })
})

const markBuletPosition = (paramPositon) => {
    const bulets = divBultests[paramPositon].querySelectorAll('span div')
    bulets.forEach(bulet => bulet.style.backgroundColor = '')
    const position = divVersos[paramPositon].scrollLeft / (width * 0.88)
    bulets[parseInt(position)].style.backgroundColor = 'blue'
}

divVersos.forEach((el, i) => el.addEventListener('scroll', () => markBuletPosition(i)))

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
            if (exists.length !== 0) {
                throw new Error('Você já adicionou este item no carrinho!')
            }
            const img = e.target.img.src
            const price = e.target.price.value
            const qty = e.target.qty.value
            const order = {
                img, price, size, qty, desc: desc[0].id
            }
            if (orderExists) {
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

versos.forEach((verso, i) => {
    verso.addEventListener('click', () => flip[i].style.transform = '')
})

let moveHand = false
fronts.forEach((el, i) => {
    el.addEventListener('click', () => {
        flip[i].style.transform = 'rotateY(180deg)'
        if (moveHand === false) {
            moveHand = true
            const div = document.createElement('div')
            div.classList.add('hand')
            const img = document.createElement('img')
            img.src = 'src/assets/img/left-click.png'
            div.append(img)

            setTimeout(() => container[i].append(div), 500)
            setTimeout(() => container[i].removeChild(div), 3000)
        }
    })
})

divVersos.forEach((verso, i) => divBultests[i].setAttribute('data-index-products', i))

window.addEventListener('load', () => {
    if (orderExists.length > 0) {
        cartQty.innerHTML = orderExists.length
    }
    const sizeImg = document.querySelector('.container img')
    container.forEach(el => {
        el.style.height = `${sizeImg.clientHeight + 220}px`
    })
    menuIsactive()
})

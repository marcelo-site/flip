if (!localStorage.hasOwnProperty('cart')) {
    localStorage.setItem('cart', JSON.stringify([]))
}

const orderExists = JSON.parse(localStorage.getItem('cart'))
const content = document.querySelector('#content')
const totCart = document.querySelector('#total')
const cartQty = document.querySelector('#cart-qty')
const whats = document.querySelector('#whats')
const date = new Date().toLocaleDateString('pt-br').replace(/\//g, '-')
import { menuIsactive } from "./menu.js"

// function delete product do cart
const deleteProduct = async (param) => {
    try {
        const res = confirm('tem certeza que deseja excluir esse item?')
        if (res === true) {
            orderExists.splice(param, 1)
            const child = document.querySelectorAll('.container')[param]
            content.removeChild(child)
            localStorage.setItem('cart', JSON.stringify(orderExists))
            const qty = parseInt(cartQty.innerHTML)
            cartQty.innerHTML = qty - 1
            const del = document.querySelectorAll('.del')
            del.forEach((el, i) => el.onclick = () => deleteProduct(i))
            insertUrlZap()
        }
    } catch (error) {
        console.log(error)
    }
}

// gerar pdf
const generetePDF = document.querySelector('#pdf')
generetePDF.addEventListener('click', () => {
    const date = new Date().toLocaleDateString('pt-br').replace(/\//g, '-')
    const options = {
        margin: 1,
        filename: `pedido-catalogo-incrivel-${date}.pdf`,
        html2canvas: { sacle: 2 },
        pagebreak: { avoid: '.container' },
        image: { type: 'jpeg', quality: 0.98 },
        jsPDF: { unit: "mm", format: "a6", orientation: "portrait" }
    }
    html2pdf().set(options).from(content).save()
})

const insertContent = async () => {
    if (orderExists.length > 0) {
        try {
            const result = await Promise.allSettled(orderExists.map(async (order, index) => {
                const divOrder = document.createElement('div')
                divOrder.classList.add('container')
                const div = document.createElement('div')
                div.classList.add('front')
                const divImg = document.createElement('div')
                const img = document.createElement('img')
                const urlImg = order.img
                const myBlob = await fetch(urlImg)
                if (!myBlob.ok) {
                    throw new Error('Imagem ausente!')
                }
                const srcImg = await myBlob.blob()
                img.src = URL.createObjectURL(srcImg);
                divImg.append(img)
                div.append(divImg)

                const divInfo = document.createElement('div')
                divInfo.classList.add('info')
                const info = order.desc.split('-')
                const title = document.createElement('h2')
                title.innerHTML = info[2]
                divInfo.append(title)
                const price = document.createElement('p')
                price.innerHTML = `<span class="bold">Preço: </span> ${order.price}`
                price.classList.add('price')
                divInfo.append(price)
                const size = document.createElement('p')
                size.innerHTML = `<span class="bold">Tamanho: </span>${order.size}`
                divInfo.append(size)
                const qty = document.createElement('p')
                qty.innerHTML = `<span class="bold">Quantidade:</span> ${order.qty}`
                divInfo.append(qty)
                div.append(divInfo)

                const subTotal = document.createElement('p')
                subTotal.classList.add('subtotal')
                const subTotalOrder = (parseFloat(order.price) * parseInt(order.qty))
                    .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                subTotal.innerHTML = `<span class="bold">Subtotal: </span> <span class="subtotal_order">${subTotalOrder}</span>`
                const del = document.createElement('button')
                del.classList.add('del')
                del.onclick = () => deleteProduct(index)
                del.innerHTML = '<i class="bi bi-trash-fill"></i>'
                subTotal.append(del)

                divInfo.append(subTotal)
                divOrder.append(div)
                return divOrder
            }))
            await Promise.all(result.map(async el => {
                content.append(el.value)
            }))
        } catch (error) {
            console.log(error)
        }
    }
    else {
        const div = document.createElement('div')
        div.style.textAlign = 'center'
        div.innerHTML = 'Não Há produtos no momento!'
        content.append(div)
    }
}

const insertUrlZap = () => {
    let str = '\n*Catálogo incrivél!* \n\n'
    str += `*Resumo do pedido realizado em ${date}* \n`
    let tot = 0
    orderExists.forEach(el => {
        const id = el.desc
        str += `*produto:* ${id.split('-')[2]}`
        str += `*cor:* ${id.split('-')[1]} \n`
        str += `*id:* ${id}\n`
        str += `*url da imagem:* ${el.img} \n`
        str += `*tamanho:* ${el.size} \n`
        str += `*preço:* ${parseFloat(el.price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} \n`
        str += `*quantidade:* ${el.qty} \n`
        const subtotal = parseInt(el.qty) * parseFloat(el.price)
        tot += subtotal
        str += `*subtotal:* ${parseFloat(subtotal.toFixed(2)).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} \n\n`
    })
    const textUrl = window.encodeURIComponent(str + `*Total*: ${tot.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} \n`)
    const url = `https://api.whatsapp.com/send?phone=5581991869812&text=${textUrl}`
    whats.href = url
}
insertUrlZap()

window.addEventListener('load', async () => {
    await insertContent()
    if (orderExists.length > 0) {
        cartQty.innerHTML = orderExists.length
    }

    setTimeout(() => {
        const container = Array.from(document.querySelectorAll('.container'))
        const imgDiv = document.querySelector('.container img')
        if (imgDiv) {
            container.map(el => {
                el.style.height = `${parseInt(imgDiv.clientHeight) + 140}px`
            })
        }
        const total = Array.from(document.querySelectorAll('.subtotal_order'))
            .reduce((acc, cur) => acc + parseFloat(cur.innerHTML.replace('R$&nbsp;', '').replace(',', '.')), 0)
        const span = document.createElement('span')
        span.style.color = 'red'
        span.innerHTML = total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
        totCart.prepend(span)
    }, 300)
    menuIsactive()
})
if (!localStorage.hasOwnProperty('cart')) {
    localStorage.setItem('cart', JSON.stringify([]))
}

const orderExists = JSON.parse(localStorage.getItem('cart'))
const content = document.querySelector('#content')
const totCart = document.querySelector('#total')

const insertContent = async () => {
    if (orderExists.length > 0) {
        try {
            await Promise.all(orderExists.map(async (order, i) => {
                const divContainer = document.createElement('div')
                divContainer.classList.add('container')
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
                divInfo = document.createElement('div')
                divInfo.classList.add('info')
                const info = order.desc.split('-')
                const title = document.createElement('h2')
                title.innerHTML = info[2]
                divInfo.append(title)

                const cor = document.createElement('h3')
                cor.innerHTML = info[1]
                divInfo.append(cor)
                const price = document.createElement('p')
                price.innerHTML = `<span class="bold">Preço: </span> ${order.price}`
                divInfo.append(price)
                const sizeQty = document.createElement('p')
                sizeQty.innerHTML = `<span class="bold">Tamanho: </span>${order.size} <span class="bold">Quant:</span> ${order.qty}`
                divInfo.append(sizeQty)
                div.append(divInfo)
                const subTotal = document.createElement('p')
                price.classList.add('price')
                subTotal.innerHTML = `<span class="bold">Subtotal: </span> <span class="subtotal">${parseFloat(order.price) * parseInt(order.qty)}</span>`
                divInfo.append(subTotal)
                divContainer.append(div)
                content.append(divContainer)
                return
            }))
        } catch (error) {
            console.log(error)
        }
       
    } else {
        const div = document.createElement('div')
        div.innerHTML = 'Não Há produtos no momento!'
        content.append(div)
    }
}

// gerar pdf
const generetePDF = document.querySelector('#pdf')

generetePDF.addEventListener('click', () => {
    const options = {
        margin: 1,
        filename: "arquivo.pdf",
        html2canvas: { sacle: 2 },
        pagebreak: {
            //  before: '.beforeClass', after: ['#after1', '#after2'],
         avoid: '.container' },
        image: { type: 'jpeg', quality: 0.98 },
        jsPDF: { unit: "mm", format: "a5", orientation: "portrait" }
    }
    console.log(content)
    html2pdf().set(options).from(content).save()
})

window.addEventListener('load', () => {
    insertContent()
    setTimeout(() => {
        const container = Array.from(document.querySelectorAll('.container'))
        const sizeImg = document.querySelector('.container img').clientHeight
        container.map(el => {
            el.style.height = `${parseInt(sizeImg) + 150}px`
        })
        const total = Array.from(document.querySelectorAll('.subtotal'))
            .reduce((acc, cur) => acc + parseFloat(cur.innerHTML), 0)
        const span = document.createElement('span')
        span.innerHTML = `<span class="bold">O total da sua sacola é:</span> ${total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`
        totCart.prepend(span)
    }, 300)
} )
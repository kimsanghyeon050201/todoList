const emptyPage = document.getElementById('empty')
const listPage = document.getElementById('list')

fetch('http://localhost:3000/list', {
    method: "GET",
}).then((data) => data.json()).then((data) => {
    const result = data.result

    const len = Object.keys(result).length

    if (len === 0) {
        emptyPage.style.display = 'flex'
        listPage.style.display = 'none'
    } else {
        emptyPage.style.display = 'none'
        listPage.style.display = 'block'

        for (let i = 0; i < len; i++) {
            const num = listPage.children[listPage.children.length - 1]
            const li = document.createElement('li')
            const div = document.createElement('div')
            const textInput = document.createElement('input')
            const checkbox = document.createElement('input')
            const cbLabel = document.createElement('label')
            const penWrapper = document.createElement('span')
            const pen = document.createElement('i')
            const trashWrapper = document.createElement('span')
            const trash = document.createElement('i')

            textInput.value = result[i].content
            textInput.disabled = 'true'
            textInput.classList.add('input-text')

            checkbox.type = 'checkbox'
            checkbox.id = `cb${i}`
            checkbox.addEventListener('change', checkboxEvent(result[i].id))

            cbLabel.setAttribute('for', `cb${i}`)

            pen.setAttribute('class', 'fas fa-solid fa-pen')
            trash.setAttribute('class', 'fas fa-solid fa-trash')

            pen.style.marginLeft = '10px'
            trash.style.marginLeft = '10px'

            penWrapper.addEventListener('click', penEvent(result[i].id))
            trashWrapper.addEventListener('click', trashEvent(result[i].id))

            penWrapper.appendChild(pen)
            trashWrapper.appendChild(trash)

            div.appendChild(checkbox)
            div.appendChild(cbLabel)
            div.appendChild(penWrapper)
            div.appendChild(trashWrapper)

            li.appendChild(textInput)
            li.appendChild(div)

            listPage.insertBefore(li, num)
        }
    }
})

function checkboxEvent(id) {
    return function (event) {
        const target = event.target
        console.log(`${event.target.id} : ${event.target.checked}, ${id}`)

        if(target.checked){

        }
    }
}
function penEvent(id) {
    return function (event) {
        console.log(`${id}`)
    }
}
function trashEvent(id) {
    return function (event) {
        console.log(`${id}`)
    }
}
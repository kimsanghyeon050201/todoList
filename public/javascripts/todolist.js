const emptyPage = document.getElementById('empty')
const listPage = document.getElementById('list')
let flag = false

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
            textInput.disabled = true
            textInput.classList.add('input-text')

            checkbox.type = 'checkbox'
            checkbox.id = `cb${i}`
            checkbox.addEventListener('change', checkboxEvent(result[i].id, textInput))

            cbLabel.setAttribute('for', `cb${i}`)

            pen.setAttribute('class', 'fas fa-solid fa-pen')
            trash.setAttribute('class', 'fas fa-solid fa-trash')

            pen.style.marginLeft = '10px'
            trash.style.marginLeft = '10px'

            penWrapper.addEventListener('click', penEvent(result[i].id, textInput))
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

function checkboxEvent(id, inputBox) {
    return function (event) {
        const target = event.target

        if (target.checked) {
            inputBox.style.textDecoration = 'line-through'
        } else {
            inputBox.style.textDecoration = 'none'
        }
    }
}
function penEvent(id, inputBox) {
    return function (event) {
        if (!flag) {
            inputBox.style.border = 'solid 1px black'
            inputBox.disabled = false
        } else {
            inputBox.style.border = 'none'
            inputBox.disabled = true
        }
        flag ^= true
    }
}
function trashEvent(id) {
    return function (event) {
        console.log(`${id}`)
    }
}
function onoffSwitch() {
    return function (event) {

    }
}
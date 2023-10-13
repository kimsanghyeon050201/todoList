const emptyPage = document.getElementById('empty')
const listPage = document.getElementById('list')
const onoff = document.getElementById('switch')
const btn = document.getElementById('btn')
const addText = document.getElementById('txt')
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
        
        if(localStorage.getItem('onoff') === 'true'){
            on(result)
        }else{
            off(result, Object.keys(result).length)
        }
    }
})

btn.addEventListener('click', () => {
    fetch('http://localhost:3000/list/add', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "content": txt.value
        })
    }).then((res) => {
        return res.json()
    }).then((data) => {
        
        if (data.message === 'success') {
            location.reload()
        }
    }).catch((err) => {
        console.error(`err : ${err}`)
    })
})

onoff.addEventListener('change', (event) => {
    const target = event.target

    fetch('http://localhost:3000/list', {
        method: "GET",
    }).then((data) => data.json()).then((data) => {
        const result = data.result
        if (!target.checked) {
            off(result, Object.keys(result).length)
        } else {
            on(result)
        }
        localStorage.setItem("onoff", target.checked)
    })
})

function createList(arr, len) {


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
        let flag = false
        const { id, content, state } = arr[i]

        textInput.value = content
        textInput.disabled = true
        textInput.classList.add('input-text')
        if (state) {
            textInput.style.textDecoration = 'line-through'
        }

        checkbox.type = 'checkbox'
        checkbox.id = `cb${i}`
        checkbox.checked = state ? true : false
        checkbox.addEventListener('change', checkboxEvent(id, textInput))

        cbLabel.setAttribute('for', `cb${i}`)

        pen.setAttribute('class', 'fas fa-solid fa-pen')
        trash.setAttribute('class', 'fas fa-solid fa-trash')

        pen.style.marginLeft = '10px'
        trash.style.marginLeft = '10px'

        penWrapper.addEventListener('click', penEvent(id, textInput, flag))
        trashWrapper.addEventListener('click', trashEvent(id))

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

function removeAllList() {
    const liElements = listPage.getElementsByTagName('li')

    for (let i = liElements.length - 1; i >= 0; i--) {
        listPage.removeChild(liElements[i])
    }
}

function off(arr, len) {
    onoff.checked = false
    removeAllList()
    createList(arr,len)
}

function on(arr) {
    onoff.checked = true
    removeAllList()

    const stateTure = arr.filter(data => data.state == 1)
    const stateFalse = arr.filter(data => data.state == 0)
    const concatArr = stateFalse.concat(stateTure)

    createList(concatArr, concatArr.length)
}

function checkboxEvent(id, inputBox) {
    return function (event) {
        const target = event.target

        if (target.checked) {
            inputBox.style.textDecoration = 'line-through'
        } else {
            inputBox.style.textDecoration = 'none'
        }
        fetch('http://localhost:3000/list/state/edit', {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": id,
                "state": target.checked
            })
        }).catch(err => {
            console.error(`err : ${err}`)
        })
        location.reload()
    }
}
function penEvent(id, inputBox, flag) {
    return function (event) {
        if (!flag) {
            inputBox.style.border = 'solid 1px black'
            inputBox.disabled = false
        } else {
            inputBox.style.border = 'none'
            inputBox.disabled = true

            fetch("http://localhost:3000/list/content/edit", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "id": id,
                    "content": inputBox.value
                })
            }).catch((err) => {
                console.error(`err : ${err}`)
            })

            location.reload()
        }
        flag ^= true
    }
}
function trashEvent(id) {
    return function (event) {
        fetch("http://localhost:3000/list/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": id
            })
        }).then((res) => {
            return res.json()
        }).then((data) => {
            console.log(data)
            if (data.message === 'success') {
                location.reload()
            }
        }).catch((err) => {
            console.error(`err : ${err}`)
        })
    }
}

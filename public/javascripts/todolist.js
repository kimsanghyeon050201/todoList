const emptyPage = document.getElementById('empty')
const listPage = document.getElementById('list')
const onoff = document.getElementById('switch')
const btn = document.getElementById('btn')
const addText = document.getElementById('txt')

//db 조회해서 초기 화면 리스트를 만들기 위한 과정
fetch('http://localhost:3000/list', {
    method: "GET",
}).then((data) => data.json()).then((data) => {
    const result = data.result

    console.log(result)
    const len = Object.keys(result).length

    if (len === 0) {
        //리스트가 없으면 empty화면을 띄움
        emptyPage.style.display = 'flex'
        listPage.style.display = 'none'
    } else {
        //리스트가 있으면 list목록을 띄움
        emptyPage.style.display = 'none'
        listPage.style.display = 'block'

        //스위치 on상태 일때 판단
        if (localStorage.getItem('onoff') === 'true') {
            on(result)
        } else {
            off(result, Object.keys(result).length)
        }

    }
})

//add item 버튼 이벤트
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

//스위치 온 오프 이벤트
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


//동적으로 리스트를 추가하는 함수
function createList(arr, len) {


    for (let i = 0; i < len; i++) {
        //스위치 위에서 부터 리스트를 만들기 위한 Object들
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
            textInput.style.opacity = '0.4'
        }

        checkbox.type = 'checkbox'
        checkbox.id = `cb${i}`
        checkbox.checked = state ? true : false
        checkbox.addEventListener('change', checkboxEvent(id, textInput))

        cbLabel.setAttribute('for', `cb${i}`)

        //icon 만들기
        pen.setAttribute('class', 'fas fa-solid fa-pen')
        trash.setAttribute('class', 'fas fa-solid fa-trash')

        pen.style.marginLeft = '10px'
        trash.style.marginLeft = '10px'

        penWrapper.style.cursor = 'pointer'
        trashWrapper.style.cursor = 'pointer'

        //Wrapper로 감싸주지 않으면 클릭 이벤트가 발생을 하지 않음
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

//li태그를 지우는 함수
function removeAllList() {
    const liElements = listPage.getElementsByTagName('li')

    for (let i = liElements.length - 1; i >= 0; i--) {
        listPage.removeChild(liElements[i])
    }
}

//스위치 온 이벤트
function off(arr, len) {
    onoff.checked = false
    removeAllList()
    createList(arr, len)
}

//스위치 오프 이벤트
function on(arr) {
    onoff.checked = true
    removeAllList()

    const stateTure = arr.filter(data => data.state == 1)
    const stateFalse = arr.filter(data => data.state == 0)
    const concatArr = stateFalse.concat(stateTure)

    createList(concatArr, concatArr.length)
}

//체크박스 이벤트
function checkboxEvent(id, inputBox) {
    return function (event) {
        const target = event.target

        if (target.checked) {
            inputBox.style.textDecoration = 'line-through'
            inputBox.style.opacity = '0.4'
        } else {
            inputBox.style.opacity = '1'
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

        // location.reload()
    }
}

//수정 이벤트
function penEvent(id, inputBox, flag) {
    return function (event) {
        if (!flag) {
            inputBox.style.border = 'solid 0.5px black'
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

            // location.reload()
        }
        flag ^= true
    }
}

//지우는 이벤트
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

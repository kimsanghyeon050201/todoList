
fetch('http://localhost:3000/list', {
    method : "GET",
}).then((data)=>data.json()).then((data)=>{
    const result = data.result

    const len = Object.keys(result).length
    
    if(len === 0){
        const emptyPage = document.getElementById('empty')
        const listPage = document.getElementById('list')
        
        emptyPage.style.display = 'flex'
        listPage.style.display = 'none'
    }else{
        const emptyPage = document.getElementById('empty')
        const listPage = document.getElementById('list')
        
        emptyPage.style.display = 'none'
        listPage.style.display = 'block'

        for(let i = 0; i < len; i++){
            const num = listPage.children[listPage.children.length - 1]
            const li = document.createElement('li')
            const div = document.createElement('div')
            const checkbox = document.createElement('input')
            const cbLabel = document.createElement('label')
            const pen = document.createElement('i')
            const penLabel = document.createElement('label')
            const trash = document.createElement('i')
            const trashLabel = document.createElement('label')

            checkbox.type = 'checkbox'
            checkbox.id = `cb${i}`
            cbLabel.setAttribute('for', `cb${i}`)
            
            pen.setAttribute('class', 'fas fa-solid')
            // pen.classList.add('fas','fa-solid fa-pen')
            // trash.classList.add('fas','fa-solid fa-trash')
            // penLabel.prepend(pen)
            // trashLabel.prepend(trash)

            div.appendChild(checkbox)
            div.appendChild(cbLabel)
            // div.appendChild(penLabel)
            // div.appendChild(trashLabel)
            div.appendChild(pen)
            div.appendChild(trash)

            li.textContent = result[0].content
            li.appendChild(div)

            listPage.insertBefore(li, num)
        }
    }
})
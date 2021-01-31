let nt = document.getElementById('novat');
let cancel = document.getElementById('cancelar');
let m = document.getElementById('modal')

nt.addEventListener('click', () =>{
    m.classList.add('active');
})
cancel.addEventListener('click', () => {
    m.classList.remove('active')
})

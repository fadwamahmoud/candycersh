function createEvents(squares){
squares.forEach((s)=>{
    s.addEventListener('dragStart', ()=>{console.log("hello")});
    s.addEventListener('dragEnd');
    s.addEventListener('dragStop');

    s.addEventListener('dragOver');

    s.addEventListener('dragEnter');

    s.addEventListener('dragLeave');

})
}
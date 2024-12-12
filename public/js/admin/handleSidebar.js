const show = (ele)=>{
    const getHeight = ()=>{
      ele.style.display='block';
      const height = ele.scrollHeight + 'px';
      ele.style.display='';
      return height;
    }
    const height = getHeight();
    ele.classList.add('is-visible');
    ele.style.height= height;
    window.setTimeout(()=>{
      ele.style.height= '';
    },350)
   
}

const hide =(ele)=>{
    ele.style.height= ele.scrollHeight + 'px';
    window.setTimeout(()=>{
      ele.style.height= 0;
    },1);

    window.setTimeout(()=>{
      ele.classList.remove('is-visible');
    },350)
}

export const toggle = (e)=>{
    e.preventDefault();
    const targetElement = document.querySelector(e.currentTarget.dataset.target);    
    if(targetElement.classList.contains('is-visible')){
      hide(targetElement)
    }else{
     show(targetElement)
    }
}
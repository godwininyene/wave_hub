import axios from 'axios';
import { showAlert } from './alert';

export const createCategory = async name=>{
    try{
        const res = await  axios({
            method:"POST",
            url: '/api/v1/categories',
            data:{
                name
            }
        });

        if(res.data.status === 'success'){
            showAlert('success', 'Category added successfully!');
            window.setTimeout(()=>{
                location.assign('/manage_categories')
            }, 1000)
        }
    }catch(err){
        alert("error")
    }
}

export const getCategories = async(element, type)=>{
    try{
        const res = await  axios({
            method:"GET",
            url: '/api/v1/categories',
        });

        if(res.data.status === 'success'){
           res.data.data.categories.forEach(cat => {
                if(type === 'select'){
                    let option = `<option value=${cat.id}>${cat.name}</option>`;
                   
                    element.insertAdjacentHTML('beforeEnd', option)
                }

                if(type === 'home-categories'){
                    const markup = `
                        <li>
                            <a href='/category/${cat.name}/${cat.id}' class='cat_links inline-block py-2 px-3 font-semibold uppercase transition-all duration-100 hover:bg-primary-light hover:text-white text-[10px]'> ${cat.name} </a>
                        </li>   
                    `
                    element.innerHTML+=markup;
                }

                if(type === 'sidebar'){
                    const markup = `
                    <li>
                        <a href='/category/${cat.name}/${cat.id}' class='inline-block py-2 px-3 mb-2 rounded font-semibold uppercase text-[10px] transition-all duration-100 hover:bg-primary-light bg-dark text-white'> ${cat.name} </a>
                    </li>   
                `
                element.innerHTML+=markup;
                }
           });
           
        }
    }catch(err){
        console.log(err)
    }
}
import '@babel/polyfill'
import { toggle } from './handleSidebar';
import { logout } from '../login';
import { updateSettings } from './updateSettings';
import { createCategory } from '../category';
import { getCategories } from '../category';
import { controlPost } from './post';
import { deletePost } from './post';
import { handleCommentStatus, deleteComment } from '../comment';
import {LoadingIndicator} from './loader'
import { showModal, setModalMessage } from './modal';
import { createUser } from './user';

//DOM
const dropdown = document.querySelectorAll('.dropdown');
const logOutBtn = document.querySelector('#loggedOut-btn');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const categoryForm = document.querySelector('.category-form');
const postForm = document.querySelector('.post-form');
const deletePostBtns = document.querySelectorAll('.delete-post-btn');
const deleteCommentBtns = document.querySelectorAll('.delete-comment-btn');
const editPostForm = document.querySelector('.edit-post-form');
const postCategory = document.querySelector('#post_category')
const commentApprovalBtns = document.querySelectorAll('.comment-approval-btn');
const addUserForm = document.querySelector('.add-user-form');
const navBtn = document.querySelector('#nav-btn');
const editor = document.querySelector('#body');

//Delegation
dropdown.forEach(el=>{
    el.addEventListener('click', (e)=>{
        toggle(e)
    })
});

navBtn.addEventListener('click', ()=>{
   const navIcon = document.querySelector('.nav-icon');
    const sidebar = document.querySelector('#sidebar')
    if(sidebar.className.includes('-left-80')){
        sidebar.classList.remove('-left-80')
        sidebar.classList.add('left-0')
        navIcon.classList.add('fa-close')

    }else{
        sidebar.classList.add('-left-80')
        sidebar.classList.remove('left-0')
        navIcon.classList.remove('fa-close')
    }
    
})

if(logOutBtn){
    logOutBtn.addEventListener('click', logout)
}

if(editor){
   
    ClassicEditor
    .create(editor, {
        
        toolbar: [ 
            'heading', '|', 
            'bold', 'italic', 'underline', 'strikethrough', '|', 
            'bulletedList', 'numberedList', 'blockQuote', '|', 
            'insertTable', 'mediaEmbed', 'undo', 'redo', '|', 
            'link', 'imageUpload' 
        ],
        ckfinder: {
            uploadUrl: '/api/v1/posts/upload'
        }
    }).then(()=> console.log('CKEDITOR CONNECTED'))
    .catch( error => {
        console.error( error );
    });
}

if(addUserForm){
    addUserForm.addEventListener('submit', async e=>{
        e.preventDefault();
        document.querySelector("#save-user-btn").innerHTML+=`<i class="fas fa-circle-notch animate-spin duration-1000">`;
        const form = new FormData(e.target);
        await createUser(form, e);
        document.querySelector("#save-user-btn").innerHTML='';
        document.querySelector("#save-user-btn").textContent = "Add User"
    } )
}

if(userDataForm){
    userDataForm.addEventListener('submit', async(e)=>{
        e.preventDefault();
        document.querySelector("#save-data-btn").innerHTML+=`<i class="fas fa-circle-notch animate-spin duration-1000">`;
        const form = new FormData(e.target);
        await updateSettings(form, 'data');
        document.querySelector("#save-data-btn").innerHTML='';
        document.querySelector("#save-data-btn").textContent = "Save settings"
    });
}

if(userPasswordForm){
    userPasswordForm.addEventListener('submit', async(e)=>{
        e.preventDefault();
        document.querySelector("#save-password-btn").innerHTML+=`<i class="fas fa-circle-notch animate-spin duration-1000">`;
        const passwordCurrent = document.getElementById("password-current").value
        const password = document.getElementById("password").value
        const passwordConfirm = document.getElementById("password-confirm").value
        await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');
        document.querySelector("#save-password-btn").innerHTML='';
        document.querySelector("#save-password-btn").textContent = "Save Password"
    });
}

if(categoryForm){
    categoryForm.addEventListener('submit', async e=>{
        e.preventDefault();
        document.querySelector(".category-btn").innerHTML+=`<i class="fas fa-circle-notch animate-spin duration-1000">`;
        const name  = document.querySelector('#cat_title').value;
        await createCategory(name);
        document.querySelector(".category-btn").innerHTML='';
        document.querySelector(".category-btn").textContent = 'Add Category';
    })
}

if(postCategory){
    getCategories(postCategory, 'select');
}


if(postForm){
    postForm.addEventListener('submit', async e=>{
        e.preventDefault();
        
        document.querySelector(".post-btn").innerHTML+=`<i class="fas fa-circle-notch animate-spin duration-1000">`;
        const form = new FormData(e.target);
        await controlPost(form, 'add','',  e);
        document.querySelector(".post-btn").innerHTML='';
        document.querySelector(".post-btn").textContent='Add Post';
       ;
    })
}


if(editPostForm){
    editPostForm.addEventListener('submit', async e=>{
        e.preventDefault();
        const id = e.target.dataset.id;
        document.querySelector(".edit-post-btn").innerHTML+=`<i class="fas fa-circle-notch animate-spin duration-1000">`;
        const form = new FormData(e.target);
        await controlPost(form, 'edit', id);
        document.querySelector(".edit-post-btn").innerHTML='';
        document.querySelector(".edit-post-btn").textContent='Update Post';
        e.target.reset();
    })
}


if (deletePostBtns) {
    deletePostBtns.forEach(btn => {
        btn.addEventListener('click', async e => { 
            // Get closest element with `data-id`
            const target = e.target.closest('.delete-post-btn');
            if (target) {
                const post_id = target.dataset.id;
                setModalMessage('Delete Post', ' Are you sure you want to delete this post? This action will cause all comments associated with this post to be deleted as well.')
                showModal(deletePost, post_id);
            }
        });
    });
}

if(deleteCommentBtns){
    deleteCommentBtns.forEach(btn =>{
        btn.addEventListener('click', async e=>{
            // Get closest element with `data-id`
            const target = e.target.closest('.delete-comment-btn');
            if (target) {
                const comment_id = target.dataset.id;
                setModalMessage('Delete Comment', ' Are you sure you want to delete this comment?')
                showModal(deleteComment, comment_id);
            }
        })
    })
}


if(commentApprovalBtns){
    commentApprovalBtns.forEach(btn =>{
        btn.addEventListener('click', async e =>{
            // Get closest element with `data-status`
            const target = e.target.closest('.comment-approval-btn');
            if (target) {
                const status = target.dataset.status;
                const id = target.dataset.id;    
                setModalMessage(`${status.charAt(0).toUpperCase() + status.slice(1)} Comment`, `Are you sure you want to ${status} this comment?`)
                showModal(handleCommentStatus, id, status);
            }
        })
    })
}
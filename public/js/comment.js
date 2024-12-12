import axios from 'axios'
import { showAlert } from './alert';
import { handleError } from './error';

export const createComment = async(id, data)=>{
    try{
        const res =  await axios({
            method:"POST",
            url:`/api/v1/posts/${id}/comments`,
            data
        });

        if(res.data.status === 'success'){
            showAlert('success', `Comment submited successfully!`)
        }
    }catch(err){
        handleError(err)
    }
}

export const handleCommentStatus = async(id, status)=>{
    try{
        const res =  await axios({
            method:"PATCH",
            url:`/api/v1/comments/${id}`,
            data:{
               status
            }
        });

        if(res.data.status === 'success'){
            showAlert('success', `Comment ${status} successfully!`)
            window.setTimeout(()=>{
                location.assign('/manage_comments')
            }, 1000)
        }
    }catch(err){
        handleError(err)
    }
}

export const deleteComment = async(id)=>{
    try{
        const res =  await axios({
            method:"DELETE",
            url:`/api/v1/comments/${id}`,
        });

        if(res.status === 204){
            showAlert('success', `Comment deleted successfully!`)
            window.setTimeout(()=>{
                location.assign('/manage_comments')
            }, 1000)
        }
    }catch(err){
        handleError(err)
    }
}
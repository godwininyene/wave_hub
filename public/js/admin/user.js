import axios from 'axios'
import { showAlert } from '../alert';
import { handleError } from '../error';

export const createUser = async(data, e)=>{
    try{
        const res =  await axios({
            method:"POST",
            url:`/api/v1/users/create`,
            data
        });

        if(res.data.status === 'success'){
            showAlert('success', `User added successfully!`)
            e.target.reset()
        }
    }catch(err){
        handleError(err)
    }
}


// export const deleteUser = async(id)=>{
//     try{
//         const res =  await axios({
//             method:"DELETE",
//             url:`/api/v1/users/${id}`,
//         });

//         if(res.status === 204){
//             showAlert('success', `User deleted successfully!`)
//             window.setTimeout(()=>{
//                 location.assign('/manage_users')
//             }, 1000)
//         }
//     }catch(err){
//         handleError(err)
//     }
// }
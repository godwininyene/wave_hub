import axios from 'axios'
import { showAlert } from './alert';
import { handleError } from './error';

export const createSubscription = async(data)=>{
    try{
        const res =  await axios({
            method:"POST",
            url:`/api/v1/subscribers`,
            data
        });

        if(res.data.status === 'success'){
            showAlert('success', `Form submitted successfully!`)
        }
    }catch(err){
        handleError(err)
    }
}

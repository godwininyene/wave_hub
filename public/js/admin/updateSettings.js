import axios from 'axios';
import { showAlert } from '../alert';

// Type is either 'password' or 'data'
export const updateSettings = async(data, type)=>{
    let url = type == 'data' ? '/api/v1/users/updateMe' : '/api/v1/users/updateMyPassword'
    try{
        const res =  await axios({
            method:"PATCH",
            url,
            data
        });

        if(res.data.status === 'success'){
            showAlert('success', `${type.toUpperCase()} updated successfully!`)
            window.setTimeout(()=>{
                location.assign('/me')
            }, 1000)
        }
    }catch(err){
       // Check if the error response contains the expected structure
        const errors = err.response?.data?.errors;
        let errorMessage = 'Something went wrong!';

        if (errors) {
            // Extract the error messages and join them into a string
            errorMessage = Object.values(errors).join(', ');
        }

        // Pass the error message to showAlert
        showAlert('error', errorMessage);
    }
}
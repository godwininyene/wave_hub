import { showAlert } from "./alert";

export const handleError = (err) => {
    const errors = err.response?.data?.errors;
    let errorMessage = 'Something went wrong!';
    if (errors) {
        errorMessage = Object.values(errors).join(', ');
    }
    showAlert('error', errorMessage);
};

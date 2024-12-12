import Toastify from 'toastify-js'
/*Type is either 'success' or 'error' */
export const showAlert = (type, msg) => {
    let backgroundStyle = '';

    // Determine the background style based on the alert type
    if (type === 'success') {
        backgroundStyle = "linear-gradient(to right, #00b09b, #96c93d)"; // Success green
    } else if (type === 'error') {
        backgroundStyle = "linear-gradient(to right, #ff5f6d, #ffc371)"; // Error red
    }

    Toastify({
        text: msg,
        className: "info",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: backgroundStyle,
        },
        onClick: function() {} // Callback after click
    }).showToast();
}

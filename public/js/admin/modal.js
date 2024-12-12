export const setModalMessage = (title, message) =>{
    document.querySelector('.modal-title').textContent = title;
    document.querySelector('.modal-text').textContent = message;
}

const clearMessage = () =>{
    document.querySelector('.modal-title').textContent = '';
    document.querySelector('.modal-text').textContent = '';
}
const hideModal = ()=>{
    //Hide main modal container
    document.querySelector('#modal').classList.add('opacity-0', 'invisible')
    //Hide modal dialog
    document.querySelector('#modal-dialog').classList.add('opacity-0', 'invisible') 
    //Clear Message
    clearMessage()
}

window.hideModal = hideModal; // Expose the function globally

const yesButton = document.getElementById('modal-yes-btn');
const yesIcon = document.getElementById('yes-icon');

const setLoaderState = isLoading => {
    if (isLoading) {
        // Change the thumbs-up icon to a spinner
        yesIcon.classList.remove('fa-thumbs-up', 'w-4', 'h-4', 'inline');
        yesIcon.classList.add('fa-circle-notch', 'animate-spin', 'duration-1000');
    } else {
        // Change the spinner back to the thumbs-up icon
        yesIcon.classList.remove('fa-circle-notch', 'animate-spin', 'duration-1000');
        yesIcon.classList.add('fa-thumbs-up', 'w-4', 'h-4', 'inline');
    }
}

export const showModal = (action, ...parameters)=>{
    //Show main modal container
    document.querySelector('#modal').classList.remove('opacity-0', 'invisible')
    //Show modal dialog
    document.querySelector('#modal-dialog').classList.remove('opacity-0', 'invisible')
    // Clear any previous event listeners to avoid duplicate handlers
    yesButton.replaceWith(yesButton.cloneNode(true));
    const newYesButton = document.getElementById('modal-yes-btn');
    // Add the specific action for the "Yes" button
    newYesButton.addEventListener('click', async() => {
        setLoaderState(true)
        await action(...parameters); // Execute the passed function
        setLoaderState(false)
        hideModal(); // Optionally hide the modal after the action
    });
}

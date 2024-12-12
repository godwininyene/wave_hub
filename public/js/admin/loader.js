export const LoadingIndicator = ({ type = 'spinner', size = 7 })=> {
    // Create a container for the indicator
    const container = document.createElement('section');
    container.style.display = 'inline-block';

    if (type === 'dots') {
        // Create bouncing dots
        const dot = document.createElement('span');
        dot.innerHTML = '<i class="fas fa-ellipsis-h"></i>'; // FontAwesome icon for dots
        dot.className = `animate-ping duration-1000 h-${size} w-${size}`;
        container.appendChild(dot);
    } else if (type === 'spinner') {
        // Create a spinning icon
        const spinner = document.createElement('span');
        spinner.innerHTML = `<i class="fas fa-circle-notch animate-spin duration-1000 h-${size} w-${size}"></i>`; // FontAwesome icon for spinner
        // spinner.class = `animate-spin duration-1000 h-${size} w-${size}`;
        container.appendChild(spinner);
    }

    return container;
}

// Example usage
// const app = document.getElementById('app'); // Assuming you have a div with id="app"
// const spinnerIndicator = LoadingIndicator({ type: 'spinner', size: 10 });
// app.appendChild(spinnerIndicator);

// const dotsIndicator = LoadingIndicator({ type: 'dots', size: 5 });
// app.appendChild(dotsIndicator);

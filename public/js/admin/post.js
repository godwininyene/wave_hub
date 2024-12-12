import axios from 'axios';
import { handleError } from '../error';
import { showAlert } from '../alert';

// Unified function to handle adding or editing posts
export const controlPost = async (data, type, id, e) => {
    const options = {
        method: type === 'add' ? 'POST' : 'PATCH',
        url: type === 'add' ? '/api/v1/posts' : `/api/v1/posts/${id}`,
        data,
    };

    try {
        const res = await axios(options);

        if (res.data.status === 'success') {
            if(e) e.target.reset()
            showAlert('success', `Post ${type === 'add' ? 'added' : 'edited'} successfully!`);
        }
    } catch (err) {
        handleError(err);
    }
};

// Function to handle deleting a post
export const deletePost = async (id) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `/api/v1/posts/${id}`,
        });

        if (res.status === 204) {
            showAlert('success', 'Post deleted successfully!');
            window.setTimeout(() => {
                location.assign('/manage_posts');
            }, 1000);
        }
    } catch (err) {
        handleError(err);
    }
};

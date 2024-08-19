import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createStory } from '../stories/storySlice';
import '../../css/createStoryForm.css'

const CreateStoryForm = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newStory = { title, image };
        dispatch(createStory(newStory));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Story Title"
                required
            />
            <input 
                type="file" 
                onChange={(e) => setImage(e.target.files[0])} 
                accept=".jpg,.jpeg,.png"
            />
            <button type="submit">Create Story</button>
        </form>
    );
};

export default CreateStoryForm;

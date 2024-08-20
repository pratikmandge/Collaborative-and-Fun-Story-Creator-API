import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createStory } from '../stories/storySlice';
import { Link } from 'react-router-dom'
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
        <main>
            <h2 id='create-story-title'>Create Story</h2>
            <form id='create-story' onSubmit={handleSubmit}>
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
                <p><Link to={"/"}>Home</Link></p>
            </form>
        </main>
    );
};

export default CreateStoryForm;

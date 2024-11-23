import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createStory } from '../stories/storySlice';
import { Link, useNavigate } from 'react-router-dom'
import '../../css/createStoryForm.css'

const CreateStoryForm = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [success, setSuccess] = useState(false)
    const [errMessage, setErrMessage] = useState({
        title: '',
        image: ''
    })
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        const newStory = { title, image };
        dispatch(createStory(newStory))
            .unwrap()
            .then(() => {
                setSuccess(true);
                setTimeout(() => {
                    navigate(`/`);
                }, 2000);
            })
            .catch((error) => {
                setTitle('');
                setImage(null);
                const newErrMessage = {
                    title: '',
                    image: ''
                };

                if (error.image) {
                    newErrMessage.image = error.image[0];
                }
                if (error.title) {
                    newErrMessage.title = error.title[0];
                }
                setErrMessage(newErrMessage);
            });
    };

    return (
        <main>
            <h2 id='create-story-title'>Create Story</h2>
            {success ? <span>Story created successfully. Now contribute to story</span> : null}
            <form id='create-story' onSubmit={handleSubmit}>
                <div>
                    {title === '' && errMessage.title != '' ? <span style={{ color: 'red', fontSize: '10px' }}>{errMessage.title}</span> : null}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Story Title"
                        required
                    />
                </div>
                <div>
                    {image === null && errMessage.image != '' ? <span style={{ color: 'red', fontSize: '10px' }}>{errMessage.image}</span> : null}
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        accept=".jpg,.jpeg,.png"
                    />
                </div>
                <button type="submit">Create Story</button>
                <p><Link to={"/"}>Home</Link></p>
            </form>
        </main>
    );
};

export default CreateStoryForm;

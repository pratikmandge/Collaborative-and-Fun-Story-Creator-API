import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStories } from '../features/stories/storySlice';

const HomePage = () => {
    const dispatch = useDispatch();
    const stories = useSelector((state) => state.stories.stories);
    const status = useSelector((state) => state.stories.status);

    useEffect(() => {
        dispatch(fetchStories());
    }, [dispatch]);

    return (
        <div>
            <h1>Stories</h1>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <p>Error loading stories.</p>}
            <ul>
                {stories?.map((story) => (
                    <li key={story.id}>{story.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;

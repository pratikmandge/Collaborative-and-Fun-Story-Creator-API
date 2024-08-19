import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStories } from '../features/stories/storySlice';
import { Link } from 'react-router-dom'
import '../css/homepage.css'

const HomePage = () => {
    const dispatch = useDispatch();
    const stories = useSelector((state) => state.stories.stories);
    const status = useSelector((state) => state.stories.status);


    useEffect(() => {
        dispatch(fetchStories());
    }, [dispatch]);

    return (
        <main>
            <div className="story-title">
                <h1>Stories</h1>
                <Link to={'/create-story'}>+ Create your own story</Link>
            </div>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <p>Please Login to see stories</p>}
            <ul className='cards'>
                {stories?.map((story) => (
                    <Link to={`story/${story.id}`} key={story.id} className="card">
                        <img src={story.image} alt={story.title} />
                        <span className="title">{story.title}</span>
                        <span className="status">
                            <b>Completed</b>: {story.completed ? <span>⦿</span> : <span>⦾</span>}
                        </span>
                        <span className="author"><b>Creator</b>: {story.author.username}</span>
                    </Link>
                ))}
            </ul>
        </main>
    );
};

export default HomePage;

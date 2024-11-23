import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchStoryContributions } from '../contributions/contributionSlice';
import { fetchSingleStories } from '../stories/storySlice';

const Story = () => {
    const { storyId } = useParams();
    const dispatch = useDispatch();
    const { contributions, status: contributionsStatus, error: contributionsError } = useSelector((state) => state.contributions);
    const { stories, status: storiesStatus, error: storiesError } = useSelector((state) => state.stories);
    const matchedStory = stories?.find(story => story.id === parseInt(storyId));
    const matchedContribution = contributions?.filter(story => story.story === parseInt(storyId))

    useEffect(() => {
        if (contributionsStatus === 'idle' || storiesStatus === 'idle') {
            dispatch(fetchStoryContributions(storyId));
            dispatch(fetchSingleStories(storyId));
        }
    }, [dispatch, storyId, contributionsStatus]);

    if (contributionsStatus === 'loading' || storiesStatus === 'loading') {
        return <div>Loading...</div>;
    }

    if (contributionsError === 'failed' || storiesError === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <main>
            <div id="contributor">
                <Link to={`contributors`}>Want to Know Contributors?</Link>
                <Link to={`contribute`}>+ Contribute to Story</Link>
            </div>
            <h2>Story: {matchedStory?.title}</h2>
            <img src={matchedStory?.image} alt="" />
            <p></p>
            {matchedContribution?.map((contribution) => (
                <span key={contribution.id}>
                    {contribution.text}{" "}
                </span>
            ))}
        </main>
    );
};

export default Story;

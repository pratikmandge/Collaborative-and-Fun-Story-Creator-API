import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { fetchStoryContributions } from '../contributions/contributionSlice';
import { fetchSingleStories } from '../stories/storySlice';
import { updateContribution, deleteContribution } from '../contributions/contributionSlice';
import '../../css/contributions.css';

const Contributors = () => {
    const { storyId } = useParams();
    const dispatch = useDispatch();
    const { contributions, status: contributionsStatus, error: contributionsError } = useSelector((state) => state.contributions);
    const { stories, status: storiesStatus, error: storiesError } = useSelector((state) => state.stories);

    const [editingId, setEditingId] = useState(null);
    const [editedText, setEditedText] = useState('');

    useEffect(() => {
        if (contributionsStatus === 'idle' || storiesStatus === 'idle') {
            dispatch(fetchStoryContributions(storyId));
            dispatch(fetchSingleStories(storyId));
        }
    }, [dispatch, storyId, contributionsStatus]);

    const handleEditClick = (contribution) => {
        setEditingId(contribution.id);
        setEditedText(contribution.text);
    };

    const handleUpdateClick = () => {
        dispatch(updateContribution({ id: editingId, updatedContribution: { story: storyId, text: editedText } }));
        setEditingId(null);
    };

    const handleDeleteClick = (id) => {
        dispatch(deleteContribution(id));
    };

    const handleCancelClick = () => {
        setEditingId(null);
        setEditedText('');
    };

    if (contributionsStatus === 'loading' || storiesStatus === 'loading') {
        return <div>Loading...</div>;
    }

    if (contributionsError || storiesError) {
        return <div>Error: {contributionsError || storiesError}</div>;
    }

    return (
        <main className='contributor'>
            <h2>Story: {stories?.[0]?.title}</h2>
            <p></p>
            <table id='contribution-table'>
                <thead>
                    <tr>
                        <th>Contributor</th>
                        <th>Contribution</th>
                        <th>Contributed On</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contributions.map((contribution) => (
                        <tr key={contribution.id}>
                            <td>{contribution.author.username}</td>
                            <td>
                                {editingId === contribution.id ? (
                                    <input
                                        type="text"
                                        value={editedText}
                                        onChange={(e) => setEditedText(e.target.value)}
                                    />
                                ) : (
                                    contribution.text
                                )}
                            </td>
                            <td>{moment(contribution.created_at).fromNow()}</td>
                            <td>
                                {editingId === contribution.id ? (
                                    <>
                                        <button onClick={handleUpdateClick}>Update</button>
                                        <button onClick={handleCancelClick}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEditClick(contribution)}>Edit</button>
                                        <button onClick={() => handleDeleteClick(contribution.id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
};

export default Contributors;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addContribution } from './contributionSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSingleStories } from '../stories/storySlice';
import '../../css/contributionForm.css'

const ContributionForm = () => {
  const [text, setText] = useState('');
  const [success, setSuccess] = useState(false);
  const { storyId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status: contributionsStatus, error: contributionsError } = useSelector((state) => state.contributions);
  const { stories, status: storiesStatus, error: storiesError } = useSelector((state) => state.stories);
  document.title = `Contribute - ${stories?.[0]?.title} | Story App`
  useEffect(() => {
    if (storiesStatus === 'idle') {
      dispatch(fetchSingleStories(storyId));
    }
  }, [dispatch, storyId, storiesStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text) {
      dispatch(addContribution({ story: storyId, text }))
        .unwrap()
        .then(() => {
          setSuccess(true);
          setText('');
          setTimeout(() => {
            navigate(`/story/${storyId}`);
          }, 2000);
        })
        .catch((error) => {
          console.error('Failed to save contribution:', error);
        });
    }
  };

  if (contributionsStatus === 'loading' || storiesStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (contributionsError || storiesError) {
    return <div>Error: {contributionsError || storiesError}</div>;
  }

  return (
    <main>
      <h2 id='story-name'>Contribute to {stories?.[0]?.title} Story</h2>
      {success && <p className="success">Thank you for your contribution!</p>}
      <form id='add-contribution' onSubmit={handleSubmit}>
        <div>
          <label htmlFor="text">Your Contribution:</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={contributionsStatus === 'loading'}>
          {contributionsStatus === 'loading' ? 'Submitting...' : 'Submit'}
        </button>
        {contributionsError && <p className="error">{contributionsError}</p>}
      </form>
    </main>
  );
};

export default ContributionForm;

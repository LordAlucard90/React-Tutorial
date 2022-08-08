import { useEffect, useRef } from 'react';
import useHttp from '../../hooks/use-http';
import { addComment } from '../../lib/api';
import LoadingSpinner from '../UI/LoadingSpinner';

import classes from './NewCommentForm.module.css';

const NewCommentForm = props => {
    const commentTextRef = useRef();
    const { sendRequest, status, error } = useHttp(addComment);

    const { onAddComment, quoteId, oldComments } = props;
    useEffect(() => {
        if (status === 'completed' && !error) {
            onAddComment();
        }
    }, [status, error, onAddComment]);

    const submitFormHandler = event => {
        event.preventDefault();

        // optional: Could validate here

        const text = commentTextRef.current.value;
        sendRequest({ quoteId, comments: [{ text, id: oldComments.length }, ...oldComments] });
    };

    return (
        <form className={classes.form} onSubmit={submitFormHandler}>
            {status === 'pending' && <LoadingSpinner />}
            <div className={classes.control} onSubmit={submitFormHandler}>
                <label htmlFor='comment'>Your Comment</label>
                <textarea id='comment' rows='5' ref={commentTextRef}></textarea>
            </div>
            <div className={classes.actions}>
                <button className='btn'>Add Comment</button>
            </div>
        </form>
    );
};

export default NewCommentForm;

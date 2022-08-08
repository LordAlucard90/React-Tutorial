import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useHttp from '../../hooks/use-http';
import { getAllComments } from '../../lib/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import CommentsList from './CommentsList';

import classes from './Comments.module.css';
import NewCommentForm from './NewCommentForm';

const Comments = () => {
    const [isAddingComment, setIsAddingComment] = useState(false);
    const { quoteId } = useParams();

    const startAddCommentHandler = () => {
        setIsAddingComment(true);
    };

    const { sendRequest, status, data: loadedComments } = useHttp(getAllComments);

    console.log(loadedComments);

    useEffect(() => {
        sendRequest(quoteId);
    }, [sendRequest, quoteId]);

    const addedCommentHandler = useCallback(() => {
        sendRequest(quoteId);
    }, [sendRequest, quoteId]);

    let commentsData;

    if (status === 'pending') {
        commentsData = (
            <div className='centered'>
                <LoadingSpinner />
            </div>
        );
    }

    if (status === 'completed' && !!loadedComments && loadedComments.length > 0) {
        commentsData = <CommentsList comments={loadedComments} />;
    }

    if (status === 'completed' && (!loadedComments || loadedComments.length === 0)) {
        commentsData = <p className='centered'>No comments yet.</p>;
    }

    return (
        <section className={classes.comments}>
            <h2>User Comments</h2>
            {!isAddingComment && (
                <button className='btn' onClick={startAddCommentHandler}>
                    Add a Comment
                </button>
            )}
            {isAddingComment && (
                <NewCommentForm
                    quoteId={quoteId}
                    onAddComment={addedCommentHandler}
                    oldComments={loadedComments}
                />
            )}
            {commentsData}
        </section>
    );
};

export default Comments;

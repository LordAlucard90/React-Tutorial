export async function getAllQuotes() {
    const response = await fetch(`http://localhost:3333/quotes`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Could not fetch quotes.');
    }

    const transformedQuotes = [];

    for (const key in data) {
        const quoteObj = {
            id: key,
            ...data[key],
        };

        transformedQuotes.push(quoteObj);
    }

    return transformedQuotes;
}

export async function getSingleQuote(quoteId) {
    const response = await fetch(`http://localhost:3333/quotes/${quoteId}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Could not fetch quote.');
    }

    const loadedQuote = {
        id: quoteId,
        ...data,
    };

    return loadedQuote;
}

export async function addQuote(quoteData) {
    await fetch(`http://localhost:3333/comments`, {
        method: 'POST',
        body: JSON.stringify({comments: []}),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const response = await fetch(`http://localhost:3333/quotes`, {
        method: 'POST',
        body: JSON.stringify(quoteData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Could not create quote.');
    }

    return null;
}

export async function addComment(requestData) {
    const response = await fetch(`http://localhost:3333/comments/${requestData.quoteId}`, {
        method: 'PUT',
        body: JSON.stringify({ comments: requestData.comments }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Could not add comment.');
    }

    return { commentId: data.name };
}

export async function getAllComments(quoteId) {
    const response = await fetch(`http://localhost:3333/comments/${quoteId}`);

    const json = await response.json();
    console.log(json);
    // const data = await response.json().comments;
    const data = json.comments;

    if (!response.ok) {
        throw new Error(data.message || 'Could not get comments.');
    }

    const transformedComments = [];

    for (const key in data) {
        const commentObj = {
            id: key,
            ...data[key],
        };

        transformedComments.push(commentObj);
    }

    return transformedComments;
}

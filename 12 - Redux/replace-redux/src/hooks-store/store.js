const { useState, useEffect } = require('react');

let globalState = {};
let listeners = [];
let actions = [];

export const useStore = (shouldListen = true) => {
    // create a new listener for the component
    const [_, setState] = useState(globalState);

    // define a function that take an actionIdentifier
    const dispatch = (actionIdentifier, payload) => {
        // runs the corrresponding action from the actions lists
        // by passing the current state and an optional payload
        const newState = actions[actionIdentifier](globalState, payload);
        // updates the global state with the updated state of the action
        globalState = { ...globalState, ...newState };
        // notifies all teh listener with the new state
        for (const listener of listeners) {
            listener(globalState);
        }
    };

    useEffect(() => {
        // attach the new component listener to the global listeners list
        if (shouldListen) {
            listeners.push(setState);
        }

        // removes the componer listener when the componenets unmounts
        return () => {
            if (shouldListen) {
                listeners = listeners.filter(cur => cur !== setState);
            }
        };
    }, [setState, shouldListen]);

    return [globalState, dispatch];
};

// accept dynamic user configuration
export const initStore = (userActions, initialState) => {
    if (!!initialState) {
        globalState = { ...globalState, ...initialState };
    }
    actions = { ...actions, ...userActions };
};

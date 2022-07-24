import React, { useCallback, useState } from 'react';

import './App.css';
import Button from './components/UI/Button/Button';
import DemoOutput from './components/Demo/DemoOutput';

function App() {
    const [showParagraph, setShowParagraph] = useState(false);
    const [allowToggle, setAllowToggle] = useState(false);

    console.log('App running!');

    const allowToggleHandler = useCallback(() => {
        setAllowToggle(true);
    }, []);

    const toggleParagraphHandler = useCallback(() => {
        if (allowToggle) {
            setShowParagraph(cur => !cur);
        }
    }, [allowToggle]);

    return (
        <div className='app'>
            <h1>Hi there!</h1>
            {/* showParagraph && <p>This is New</p> */}
            <DemoOutput show={showParagraph} />
            <Button onClick={allowToggleHandler}>Allow Toggle</Button>
            <Button onClick={toggleParagraphHandler}>Show Paragraph!</Button>
        </div>
    );
}

export default App;

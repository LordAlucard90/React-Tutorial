import { useState, useEffect } from "react";

const useCounter = (step = 1) => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prevCounter) => prevCounter + step);
        }, 1000);

        return () => clearInterval(interval);
    }, [step]);

    return counter;
};

export default useCounter;


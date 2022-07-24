import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor() {
        super();
        this.state = { hasError: false };
    }

    // is called whenever a child component throws an error
    componentDidCatch(error) {
        console.log(error);
        this.setState({ hasError: true });
    }

    render() {
        // alternative logic in case of error
        if (this.state.hasError) {
            return <p>Something went wrong!</p>;
        }

        // it is used to surround other components
        return this.props.children;
    }
}

export default ErrorBoundary;

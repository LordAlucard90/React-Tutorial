import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Greeting from './Greeting';

describe('Greeting Component', () => {
    it('should render Hello World as a test', () => {
        // Arrange
        render(<Greeting />);

        // Act
        // ... nothing

        // Assert
        // also a regex can be used
        // with exact false case is not imoprtant and also substrings are matched
        const element = screen.getByText('Hello World!', { exact: true });
        expect(element).toBeInTheDocument();
    });

    it('should render "good to see you!" if button was not clicked', () => {
        // Arrange
        render(<Greeting />);

        // Act
        // ... nothind

        // Assert
        const element = screen.getByText("It's good to see you!", { exact: true });
        expect(element).toBeInTheDocument();
    });

    it('should render "Changed!" if button was clicked', () => {
        // Arrange
        render(<Greeting />);

        // Act
        const buttonElement = screen.getByRole('button'); // there is only one
        // perform the user click
        userEvent.click(buttonElement);

        // Assert
        const element = screen.getByText('Changed!', { exact: true });
        expect(element).toBeInTheDocument();
    });

    it('should remove "good to see you!" if button was clicked', () => {
        // Arrange
        render(<Greeting />);

        // Act
        const buttonElement = screen.getByRole('button');
        userEvent.click(buttonElement);

        // Assert

        // getByText will fail if the elemnt is not found,
        // queryByText will instaed return null
        const removedElement = screen.queryByText("It's good to see you!", { exact: true });
        expect(removedElement).toBeNull();
    });
});

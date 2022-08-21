import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Asycn from './Asycn';

describe('Asycn Component', () => {
    // async needed for findXXX method
    it('should render posts if request succeedes', async () => {
        // Arrange
        render(<Asycn />);

        // Act
        // ... nothing

        // Assert
        // getByRole will fail if more than one element is found
        // getAllByRole will return an epmpy array because at the beginning
        // there are no elements, they will be created only afther the fetch
        // const elements = screen.getAllByRole('listitem');
        // the findXXX methods return a promise, and the test engine will
        // re-evaluate the test until it succeedes
        // the methos also allows to set the maximum waiting timeout if needed
        const elements = await screen.findAllByRole('listitem');
        expect(elements).not.toHaveLength(0);
    });

    it('should render posts if request succeedes (mocked)', async () => {
        // Arrange
        // override the fetch function with a mock
        window.fetch = jest.fn();
        // configure the mock behavior
        window.fetch.mockResolvedValueOnce({
            json: async () => [{ id: 0, title: 'test post' }],
        });
        render(<Asycn />);

        // Act
        // ... nothing

        // Assert
        const elements = await screen.findAllByRole('listitem');
        expect(elements).not.toHaveLength(0);
    });
});

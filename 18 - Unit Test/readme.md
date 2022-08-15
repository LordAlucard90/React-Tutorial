# Unit Tests

## Content

- [Basics](#basics)
- [First Test](#First Test)
- [Testing Suites](#testing-suites)
- [Nested Components](#nested-components)
- [Asynchronous Tests](#asynchronous-tests)
- [Mocks](#mocks)
- [Other Resources](#other-resources)

---

## Basics

React apps created with `npx create-react-app <app_name>` have allready 
installed all the needed dependencies.

Tests usually are put inside `<tested_file_name>.tests.js`.

The `App.test.js` file contains a default test for the application:
```javascript
test('renders learn react link', () => {
    // renders the app in a test environment
    render(<App />);
    // gets a rendered element in the application
    const linkElement = screen.getByText(/learn react/i);
    // check that that element is present
    expect(linkElement).toBeInTheDocument();
});
```
it is possible to run all the tests in the project using
```bash
npm test
```
it is possible to type `a` to run all the test and `w` to watch at file changes
and rerun the tests.

## First Test

Test should be written using the three As :
- Arrange: prepare the stugg aroud the test
- Act: run the logic that must be tested
- Assert: veriry the result

Given the component:
```javascript
const Greeting = () => {
    return (
        <div>
            <h2>Hello Worls!</h2>
            <p>It's good to see you</p>
        </div>
    );
};
```
the test is written in the same folder:
```javascript
import { render, screen } from '@testing-library/react';

import Greeting from './Greeting';

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
```

## Testing Suites

Tests can be gouped using suites:
```javascript
describe('Greeting Component', () => {
    it('should render Hello World as a test', () => {
        // ...
    });

    it('other stugg', () => {
        // ...
    });
});
```

## Test State

Given a component with some state:
```javascript
const Greeting = () => {
    const [changedText, setChangedText] = useState(false);

    const changeTextHandler = () => {
        setChangedText(true);
    };
    return (
        <div>
            <h2>Hello World!</h2>
            {!changedText && <p>It's good to see you!</p>}
            {changedText && <p>Changed!</p>}
            <button onClick={changeTextHandler}>Change Text!</button>
        </div>
    );
};
```
It is possible to test this new code, introducing user events in this way:
```javascript
import userEvent from '@testing-library/user-event';

// ...

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
```

## Nested Components

Given a basi component as:
```javascript
const Output = props => {
    return <p>{props.children}</p>;
};
```
and using it in place of a paragrapf:
```javascript
const Greeting = () => {
    const [changedText, setChangedText] = useState(false);

    const changeTextHandler = () => {
        setChangedText(true);
    };
    return (
        <div>
            <h2>Hello World!</h2>
            {!changedText && <Output>It's good to see you!</Output>}
            {changedText && <p>Changed!</p>}
            <button onClick={changeTextHandler}>Change Text!</button>
        </div>
    );
};
```
the tests continue working because render loads all the elemets tree.

## Asynchronous Tests

Given an asynchronous operation like:
```javascript
const Async = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(data => {
                setPosts(data);
            });
    }, []);

    return (
        <div>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default Async;
```
it is possile to write a tests that hadle this async code in this way:
```javascript
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
```

## Mocks

The tests above is not ideal because a real http request is sent.\
Better is to either fake the server during  the test of to do not send
the request but mock the behaviour.
The second approach is better because code coming from libraries 
should no be tested.

```javascript
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
```

## Other Resources

Already installed testing libraries documentation can be found at:
- [Jest](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

Another useful testing library:
- [React Hooks Testing Library](https://github.com/testing-library/react-hooks-testing-library)

Another of my repos for javascript testing:
- [JavaScript Testing](https://github.com/LordAlucard90/JavaScript-Testing)


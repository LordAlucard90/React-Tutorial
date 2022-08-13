# Animations

## Content 

- [CSS Transictions](#css-transictions)
- [CSS Animations](#css-animations)
- [CSS Limitations](#css-limitations)
- [React Transiction Group](#react-transiction-group)
- [Transition](#transition)
- [CSSTransition](#csstransition)
- [TransictionGroup](#transictiongroup)
- [Alternatives](#alternatives)

---

## CSS Transictions

It is possible to use default css transitions to make appear and dispappera
the modal:
```css
.Modal {
    // ...
    transition: all 0.3s ease-out;
}

.ModalOpen {
    /* display: block; */
    opacity: 1;
    transform: translateY(0);
}

.ModalClosed {
    /* display: none; */
    opacity: 0;
    transform: translateY(-100%);
}
```
it is necessary to remove the display because since it is not there,
thereis no need to be animated.
With opacity even if it is present, it will be insible and then the animation
make sense.

## CSS Animations

A css animation is a detailed described set of transitions, 
they gives more control:
```css
.Modal {
    // ...
    transition: all 0.3s ease-out;
}

.ModalOpen {
    animation: openModal 0.4s ease-out forwards;
}

.ModalClosed {
    animation: closeModal 0.4s ease-out forwards;
}

@keyframes openModal {
    0% {
        opacity: 0;
        transform: translateY(-100%);
    }
    50% {
        opacity: 1;
        transform: translateY(20%);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes closeModal {
    0% {
        opacity: 1;
        transform: translateY(0);
    }
    50% {
        opacity: 0.8;
        transform: translateY(60%);
    }
    100% {
        opacity: 0;
        transform: translateY(-100%);
    }
}
```

## CSS Limitations

Usin css the elements are allways present in the DOM. 
When there are a lot of elements it can slow down the application.

If the elemnts are conditionally rendered this displays correctly the open
animation, but on the close one the element is immediarelly removed and 
it is not shown.

## React Transiction Group

[React Transiction Group](https://reactcommunity.org/react-transition-group/)
is a community library used to manage transictions.
It is possible to install it using:
```bash
npm i react-transition-group
```

## Transiction

The `Transition` component uses four states to determine the what is happening:
- entering
- entered
- exiting
- exited
these states can be used in this way:
```javascript
<Transition
    in={this.state.showBlock} //
    timeout={1000} // transition time
    mountOnEnter // add when the animation starts
    unmountOnExit // remove after the animation ended
>
    {state => (
        <div
            style={{
                backgroundColor: 'red',
                width: 100,
                height: 100,
                margin: 'auto',
                transition: 'opacity 1s ease-out',
                opacity: state === 'exiting' ? 0 : 1,
            }}></div>
    )}
</Transition>
```
At the moment is played a transition only when the element is removed.

To correctly animate the Modal the transition is:
```javascript
<Transition in={this.state.modalIsOpen} timeout={300} mountOnEnter unmountOnExit>
    {state => <Modal show={state} closed={this.closeModal} />}
</Transition>
```
and in the modal:
```javascript
const modal = props => {
    const cssClasses = [
        'Modal',
        props.show === 'entering' 
        ? 'ModalOpen' 
        : (props.show === 'exiting' ? 'ModalClosed' : null),
    ];

    return (
        // ...
    );
};
```

another way to manage this component is move all the logic from the caller:
```javascript
<Modal show={this.state.modalIsOpen} closed={this.closeModal} />
```
to the modal itself:
```javascript
const modal = props => {

    return (
        <Transition in={props.show} timeout={300} mountOnEnter unmountOnExit>
            {state => {
                const cssClasses = [
                    'Modal',
                    state === 'entering' ? 'ModalOpen' : state === 'exiting' ? 'ModalClosed' : null,
                ];
                return (
                    <div className={cssClasses.join(' ')}>
                        <h1>A Modal</h1>
                        <button className='Button' onClick={props.closed}>
                            Dismiss
                        </button>
                    </div>
                );
            }}
        </Transition>
    );
};
```

### Timing

It is important that the timing set in the Transition component and the one set 
in the css are equal. This does not mean that the entering must be the same as 
the exiting:
```css
.ModalOpen {
    animation: openModal 0.4s ease-out forwards;
}

.ModalClosed {
    animation: closeModal 1s ease-out forwards;
}
```
```javascript
const animationTiming = {
    enter: 400,
    exit: 1000,
};

const modal = props => {

    return (
        <Transition in={props.show} timeout={animationTiming} mountOnEnter unmountOnExit>
            // ...
        </Transition>
    );
};
```

### Events

It is possible to add callback on the differen states, in order of execustion
there are:
```javascript
const modal = props => {

    return (
        <Transition
            in={props.show}
            timeout={animationTiming}
            mountOnEnter
            unmountOnExit
            onEnter={() => console.log('onEnter')} 
            onEntering={() => console.log('onEntering')}
            onEntered={() => console.log('onEntered')}
            onExit={() => console.log('onExit')}
            onExiting={() => console.log('onExiting')}
            onExited={() => console.log('onExited')}>
            {state => {
                // ....
            }}
        </Transition>
    );
};
```

## CSSTransition

It is also possible to use the `CSSTransition` component instead of `Transition`.\
In this case just the component must be defined in the child part and
must be defined an addicional `classNames` properties that will be merged
to the base class name depending on the state:
```javascript
const modal = props => {

    return (
        <CSSTransition
            in={props.show}
            timeout={animationTiming}
            mountOnEnter
            unmountOnExit
            onEnter={() => console.log('onEnter')}
            onEntering={() => console.log('onEntering')}
            onEntered={() => console.log('onEntered')}
            onExit={() => console.log('onExit')}
            onExiting={() => console.log('onExiting')}
            onExited={() => console.log('onExited')}
            classNames='fade-slide'>
            <div className='Modal'>
                <h1>A Modal</h1>
                <button className='Button' onClick={props.closed}>
                    Dismiss
                </button>
            </div>
        </CSSTransition>
    );
};
```
depending on the current states the added css classes will be:
- `<base_class>-enter`
- `<base_class>-enter-active`
- `<base_class>-exit`
- `<base_class>-exit-active`
in the example above the css file will be:
```css
.fade-slide-enter {
    /* some initializations */
}

.fade-slide-enter-active {
    animation: openModal 0.4s ease-out forwards;
}

.fade-slide-exit {
    /* some clean ups */
}

.fade-slide-exit-active {
    animation: closeModal 1s ease-out forwards;
}
```

### Clases Names

It is also possible to override the defautl classes' names and use custom ones:
```javascript
// ...

const animationClasses = {
    enter: '',
    enterActive: 'ModalOpen',
    exit: '',
    exitActive: 'ModalClosed',
    // for fist time on dom
    appeat: '',
    appeatActive: '',
};

const modal = props => {
    return (
        <CSSTransition
            // ...
            classNames={animationClasses}>
            // ...
        </CSSTransition>
    );
};
```

## TransictionGroup

The `TransictionGroup` component is used, on combination wiht the previous
transition components, to animate list of elements:
```javascript
const listItems = this.state.items.map((item, index) => (
    <CSSTransition key={index} classNames='fade' timeout={300}>
        <li className='ListItem' onClick={() => this.removeItemHandler(index)}>
            {item}
        </li>
    </CSSTransition>
));

return (
    <div>
        // ...
        <TransitionGroup component='ul' className='List'>
            {listItems}
        </TransitionGroup>
    </div>
);
```
It is not necessaty to set the `in` property in the transition component because
it is managed by the `TransitionGroup` component.
```css
.fade-enter {
    opacity: 0;
}

.fade-enter-active {
    opacity: 1;
    transition: opacity 0.3s ease-out;
}

.fade-exit {
    opacity: 1;
}

.fade-exit-active {
    opacity: 0;
    transition: opacity 0.3s ease-out;
}
```

## Alternatives

Alternative packages are:
- [React Motion](https://github.com/chenglou/react-motion)
- [React Move](https://github.com/sghall/react-move)
- [React Router Transictions](https://github.com/maisano/react-router-transition)


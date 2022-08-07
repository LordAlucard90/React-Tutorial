import { Component } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import classes from './Counter.module.css';
// import { counterActions } from '../store/index';
import { counterActions } from '../store/counter';

const Counter = () => {
    const counterState = useSelector(state => state.counter.counter);
    const showCounterState = useSelector(state => state.counter.showCounter);
    const dispatch = useDispatch();

    const incrementHandler = () => {
        // dispatch({ type: 'INCREMENT' });
        dispatch(counterActions.increment());
    };

    const increaseByFiveHandler = () => {
        // dispatch({ type: 'INCREASE', amount: 5 });
        dispatch(counterActions.increase(5));
    };

    const decrementHandler = () => {
        // dispatch({ type: 'DECREMENT' });
        dispatch(counterActions.decrement());
    };

    const toggleCounterHandler = () => {
        // dispatch({ type: 'TOGGLE' });
        dispatch(counterActions.toggle());
    };

    return (
        <main className={classes.counter}>
            <h1>Redux Counter</h1>
            {showCounterState && <div className={classes.value}>{counterState}</div>}
            <div>
                <button onClick={decrementHandler}>Decrement</button>
                <button onClick={incrementHandler}>Increment</button>
                <button onClick={increaseByFiveHandler}>Increase by 5</button>
            </div>
            <button onClick={toggleCounterHandler}>Toggle Counter</button>
        </main>
    );
};

export default Counter;

// class Counter extends Component {
//     incrementHandler() {
//         this.props.increment();
//     }
//
//     decrementHandler() {
//         this.props.decrement();
//     }
//
//     toggleCounterHandler() { }
//
//     render() {
//         return (
//             <main className={classes.counter}>
//                 <h1>Redux Counter</h1>
//                 <div className={classes.value}>{this.props.counter}</div>
//                 <div>
//                     <button onClick={this.decrementHandler.bind(this)}>Decrement</button>
//                     <button onClick={this.incrementHandler.bind(this)}>Increment</button>
//                 </div>
//                 <button onClick={this.toggleCounterHandler}>Toggle Counter</button>
//             </main>
//         );
//     }
// }
//
// const mapStateToProps = state => {
//     return {
//         counter: state.counter,
//     };
// };
//
// const mapDispatchToProps = dispatch => {
//     return {
//         increment: () => dispatch({ type: 'INCREMENT' }),
//         decrement: () => dispatch({ type: 'DECREMENT' }),
//     };
// };
//
// export default connect(mapStateToProps, mapDispatchToProps)(Counter);

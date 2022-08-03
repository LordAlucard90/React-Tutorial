import './ExpensesFilter.css';

const ExpensesFilter = props => {
    let optionYears = [];
    for (let year = +new Date().getFullYear(); year >= 2019; year--) {
        optionYears.push(year);
    }

    const filterSelectedHandler = event => {
        // console.log(event.target.value);
        props.onFilerChanged(event.target.value)
    };

    return (
        <div className='expenses-filter'>
            <div className='expenses-filter__control'>
                <label>Filter by year</label>
                <select value={props.curYear} onChange={filterSelectedHandler}>
                    <option value=''>-</option>
                    {optionYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ExpensesFilter;

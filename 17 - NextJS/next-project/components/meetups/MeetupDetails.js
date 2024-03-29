import style from './MeetupDetails.module.css'

const MeetupDetalils = props => {
    return (
        <section className={style.detail}>
            <img src={props.image} alt={props.title} />
            <h1>{props.title}</h1>
            <address>{props.address}</address>
            <p>{props.description}</p>
        </section>
    );
};

export default MeetupDetalils;

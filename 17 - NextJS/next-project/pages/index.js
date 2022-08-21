import Database from 'better-sqlite3';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import MeetupList from '../components/meetups/MeetupList';

// const DUMMY_MEETUPS = [
//     {
//         id: 0,
//         title: 'First Meetup',
//         image: 'https://placedog.net/500/280',
//         address: 'First Address',
//         description: 'First Description',
//     },
//     {
//         id: 1,
//         title: 'Second Meetup',
//         image: 'https://placedog.net/500/281',
//         address: 'Second Address',
//         description: 'Second Description',
//     },
//     {
//         id: 2,
//         title: 'Third Meetup',
//         image: 'https://placedog.net/500/282',
//         address: 'Third Address',
//         description: 'Third Description',
//     },
// ];

const HomePage = props => {
    // const [meetups, setMeetups] = useState([]);
    //
    // useEffect(() => {
    //     setMeetups(DUMMY_MEETUPS);
    // }, []);
    // return <MeetupList meetups={meetups} />;

    return (
        <>
            <Head>
                <title>React Meetups</title>
                <meta name='description' content='NextJS example project.' />
            </Head>
            <MeetupList meetups={props.meetups} />
        </>
    );
};

// export async function getServerSideProps(context) {
//     // optional data to correctly load the response
//     // const request = context.req;
//     // const response = context.res;
//
//     return {
//         props:{
//             meetups: DUMMY_MEETUPS,
//         }
//     }
// }

export async function getStaticProps() {
    const db = new Database('db.sqlite');
    const meetups = db.prepare('SELECT * FROM meetups').all();
    db.close();

    return {
        props: {
            meetups: meetups,
            // revalidate: 60, // minimum amount of seconds
            revalidate: 1, // minimum amount of seconds
        },
    };
}

export default HomePage;

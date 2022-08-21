import Database from 'better-sqlite3';
import Head from 'next/head';
import MeetupDetalils from '../../components/meetups/MeetupDetails.js';

// const DUMMY_MEETUP = {
//     id: 0,
//     title: 'First Meetup',
//     image: 'https://placedog.net/500/280',
//     address: 'First Address',
//     description: 'First Description',
// };

const MeetupDetalilsPage = props => {
    return (
        <>
            <Head>
                <title>{props.meetup.title}</title>
                <meta name='description' content='An example meetup.' />
            </Head>
            <MeetupDetalils
                title={props.meetup.title}
                image={props.meetup.image}
                address={props.meetup.address}
                description={props.meetup.description}
            />
        </>
    );
};

export async function getStaticPaths() {
    const db = new Database('db.sqlite');
    const paths = db
        .prepare('SELECT * FROM meetups;')
        .all()
        .map(cur => {
            return {
                params: {
                    meetupId: cur.id.toString(),
                },
            };
        });
    db.close();

    console.log(paths);
    return {
        // fallback: false,
        // fallback: true,
        fallback: 'blocking',
        paths: paths,
        // paths: [
        //     {
        //         params: {
        //             meetupId: '0',
        //         },
        //     },
        //     {
        //         params: {
        //             meetupId: '1',
        //         },
        //     },
        // ],
    };
}

export async function getStaticProps(context) {
    const db = new Database('db.sqlite');
    // optional data to correctly load the page
    const meetupId = context.params.meetupId;
    const meetup = db.prepare('SELECT * FROM meetups WHERE id = ?;').get(meetupId);
    db.close();

    return {
        props: {
            // meetup: DUMMY_MEETUP,
            meetup: meetup,
            revalidate: 60, // minimum amount of seconds
        },
    };
}

export default MeetupDetalilsPage;

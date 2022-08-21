import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NewMeetupForm from '../../components/meetups/NewMeetupForm';

const NewMeetupPage = () => {
    const router = useRouter();

    const addMeetupHandler = meetupData => {
        // console.log(meetupData);
        axios
            .post(
                '/api/new-meetup', // since it is in the same domain this is enough
                meetupData,
            )
            .then(response => {
                console.log(response);
                router.replace('/');
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <>
            <Head>
                <title>Add A New Meetups</title>
                <meta name='description' content='Add a new example meetup.' />
            </Head>
            <NewMeetupForm onAddMeetup={addMeetupHandler} />
        </>
    );
};

export default NewMeetupPage;

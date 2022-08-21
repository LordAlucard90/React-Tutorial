# NextJS

## Content

- [Intro](#intro)
- [Setup](#setup)
- [Pages](#pages)
- [Dynamic Pages](#dynamic-pages)
- [Linking Pages](#linking-pages)
- [Common Layout](#common-layout)
- [Programmatic Navigation](#programmatic-navigation)
- [Style](#style)
- [Page Pre-Rendering](#page-pre-rendering)
- [Database](#database)
- [API Routes](#aPI-routes)
- [Getting Static Data From DB](#getting-static-data-from-db)
- [Page Metadata](#page-metadata)
- [Deploy](#deploy)

---

## Intro

NextJS is a React Framwork for production. 
It is used to make full-stack applications.
And is shipped with a lot of build feature that help to solve common problems
without other libraries.

The key features of NextJS are:
- **Server-Side Rendering**\
it helps to preload code for the user at the server level.
This is helpfull SEO, without it the SEO engines only found an empty html page
that has to load all the content afterwads.
- **File-Based Routing**\
allows to define all the routing structure starting from a predefined folder
named `pages` without the in-code definition.
- **Fullstack Capabilities**\
it is possible to develop also the backend side.

## Setup

To create a NextJS project it is enough to run:
```bash
npx create-next-app <app_name>
```
the command will install:
- react
- react-dom
- next
the default folder structure include:
- `public/`: static files
- `styles/`: styles definition
- `pages/`: the rouring definition
In the public folder there is not the `index.js` file that is present in a React
project to serve the application, because NextJS takes care of pre-render
and serve the single page application provided to the user.

## Pages

It is possible to define new path creating dedicated files in the `pages/` folder.
The `index.js` file will be the the paged server at `/` while `<page>.js` 
will be served at `/<page>`:
```javascript
// index.js
const HomePage = () => {
    return <h1>The Home Page</h1>;
};

export default HomePage;
// news.js
const NewsPage = () => {
    return <h1>The News Page</h1>;
};

export default NewsPage;
```
now it is possible to start the project with:
```bash
npm run dev
# home page available at: http://localhost:3000
# news page available at: http://localhost:3000/news
```
The content of the pages is not only an empty page, but is has all the
pre-rendered content.

### Alternative Structure

A different way to provide the `news.js` page at the same path, is to put 
the file inside a `news/` folder and rename it `index.js`.

This is important when it is needed to provide sub-path, because the other
files present in that folder are then serve starting from the folder name:
```
.
├── index.js                    -> /
├── news
│   ├── index.js                -> /news
│   └── something-important.js  -> /news/something-important
└── old-news.js                 -> /old-news
```

## Dynamic Pages

Is is possible to define dynamic pages using the `[<page_id>].js` syintax
to define dynamic id that can be interpreted later.
For example:
```javascript
// [newsId].js
const DetailPage = () => {
    const router = useRouter();

    const newsId = router.query.newsId;

    return <h1>The Detail Page for: '{newsId}'</h1>;
};

export default DetailPage;
```
this approach is also available with foler naming:
```
.
├── index.js                    -> /
├── news
│   ├── [newsId]
│   │    └── index.js           -> /news/<newsId>
│   ├── index.js                -> /news
│   └── something-important.js  -> /news/something-important
└── old-news.js                 -> /old-news
```

## Linking Pages

It is possible to redirect to pages using the `<a></a>` component, but using it
will make a new call and render a completely new page.\
To avoid this behaviour and remain in the single page application world, 
it can be used the `Link` component:
```javascript
const DetailPage = () => {
    const router = useRouter();

    const newsId = router.query.newsId;

    return <h1>The Detail Page for: '{newsId}'</h1>;
};
```

## Common Layout

It is possible to create a commont `Layout` component and use it as default
layout across the whole applicaiton by adding it to the `_app.js` file:
```javascript
import '../styles/globals.css';
import Layout from '../components/layout/Layout';

function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
```
NextJS uses this component to load the pages and it is then possible to also
provide a custom layout across the application without defining it in each page.

## Programmatic Navigation

It is possible to programmatically navagate using the `useRouter` hook:
```javascript
const MeetupItem = (props) =>  {
    const router = useRouter();

    const showDetailsHandler = () => {
        router.push('/' + props.id);
    };

    return (
        // ...
    );
}
```

## Style

Linke in normal React projects, it is possible to define css modules:
```css
/* MeetupDetails.module.css */
.detail {
    text-align: center;
}

.detail img {
    width: 100%;
}
```
and import then in the components:
```javascript
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
```

## Page Pre-Rendering

There are two types of Pre-Rendering possibilities:
- Server-Side Generation
- Server-Side Rendering

### Server-Side Generation

In this case the pages are pre-rendered when the applicaiton 
is build for production.
This means that after the deployment the page does not change anymore.

To do so it is necessaty to export in the page (only in the pages works)
a `getStaticProps()` function.
This function is used to serve the props data that th application needs
and can also be asynvhronous.\
Futhermore, in this function can be executed code that goes in the backend,
this is because this code wiil be only executed during the build process
and not in the server or on the client.

```javascript
const DUMMY_MEETUPS = [
    ...
];

const HomePage = (props) => {
    // client side
    // const [meetups, setMeetups] = useState([]);
    //
    // useEffect(() => {
    //     setMeetups(DUMMY_MEETUPS);
    // }, []);
    // return <MeetupList meetups={meetups} />;

    // serverw side
    return <MeetupList meetups={props.meetups} />;
};

export async function getStaticProps() {
    return {
        props: {
            meetups: DUMMY_MEETUPS,
        },
    };
}
```
now looking at the page source it is possible to see the prerendered content
that is not loaded on the client side.

By running the command
```bash
npm run build

> next-project@0.1.0 build
> next build

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
info  - Linting and checking validity of types  
info  - Creating an optimized production build  
info  - Compiled successfully
info  - Collecting page data  
info  - Generating static pages (5/5)
info  - Finalizing page optimization  

Route (pages)                              Size     First Load JS
┌ ● /                                      711 B          80.9 kB
├   └ css/30a596c35ae2476b.css             413 B
├   /_app                                  0 B            80.2 kB
├ ○ /[meetupId]                            482 B          80.7 kB
├   └ css/009b1eea6349a691.css             83 B
├ ○ /404                                   186 B          80.4 kB
└ ○ /new-meetup                            759 B            81 kB
    └ css/6b06f286d8345586.css             360 B
+ First Load JS shared by all              80.7 kB
  ├ chunks/framework-db825bd0b4ae01ef.js   45.7 kB
  ├ chunks/main-3123a443c688934f.js        30.9 kB
  ├ chunks/pages/_app-620b65bc0b3cbc8d.js  2.82 kB
  ├ chunks/webpack-7ee66019f7f6d30f.js     755 B
  └ css/278d83c36e9ec284.css               503 B

○  (Static)  automatically rendered as static HTML (uses no initial props)
●  (SSG)     automatically generated as static HTML + JSON (uses getStaticProps)
```
the SSG page is the one with default props generated durint the build process.

A potenrial problem that can be encountered with static pages is the outdating
of the data. It is possible to set a property to re-evalute the page if reqeusts
are comming in:
```javascript
// ..

export async function getStaticProps() {
    return {
        props:{
            meetups: DUMMY_MEETUPS,
            revalidate: 60 // minimum amount of seconds
        }
    }
}
```

### Dynamic Server-Side Generation

For sub-pages like `[meetupId]/` it is possible to retrieve the id from the
context and use it to load the correct data in this way:
```javascript
export async function getStaticProps(context) {
    // optional data to correctly load the page
    const meetupId = context.params.meetupId;

    return {
        props:{
            meetup: DUMMY_MEETUP,
            revalidate: 60 // minimum amount of seconds
        }
    }
}
```
in this case is also needed to expose another reserved function to 
load all the allowed page parameters correctly:
```javascript
export async function getStaticPaths() {
    return {
        fallback: true,
        paths: [
            {
                params: {
                    meetupId: '0',
                },
            },
            {
                params: {
                    meetupId: '1',
                },
            },
        ],
    };
}
```
If the `fallback` parameter is set to `false` means that all the possible pages
were rendered and in case an unknown id is requested the `404` page is displayed.
It it is set to `true/blocking`, NextJS will try to generate the new page
on the fly. With true it will first load an empty page and then the loaded one,
with blocking will wait unit the page is generated and will return it.
In case new pages are added, like new meetups, it will fail.

### Server-Side Rendering

When the page should be re-evaluted on each reqeusts and not only after a 
fiexd amount of time, can be used:
```javascript
export async function getServerSideProps(context) {
    // optional data to correctly load the response
    // const request = context.req;
    // const response = context.res;

    return {
        props:{
            meetups: DUMMY_MEETUPS,
        }
    }
}
```
also this function name is reserved and all the code inside will only run on the 
server. Therefore, it is possible to request data to a database and so on.

## Database

In the tutorial is used `MongoDB` as database with an online instance,
since I profere to work locally, I used
[better-sqlite3](https://github.com/WiseLibs/better-sqlite3) 
```bash
npm install better-sqlite3

sudo apt install sqlitebrowser # just a GUI
```

## API Routes

Are special pages that allow to create REST endpoints.
The apis must be stored in the `pages/api/` folder.
```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');

const MEETUPS_TABLE = `
CREATE TABLE IF NOT EXISTS meetups (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL, 
    image TEXT NOT NULL,
    address TEXT NOT NULL,
    description TEXT NOT NULL
);
`;
const MEETUP_INSERT = `
INSERT INTO meetups 
    ( title, image, address, description )
VALUES (?, ?, ?, ?);
`;

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const data = req.body;

        const { title, image, address, description } = data;

        const db = new Database('db.sqlite');
        // can be commented out after the first execution
        // db.exec(MEETUPS_TABLE);
        const lastId = db
            .prepare(MEETUP_INSERT)
            .run(title, image, address, description).lastInsertRowid;
        console.log('Inserted id: ', lastId);
        db.close();

        res.status(201).json({ message: 'success' });
    }
};

export default handler;
```

## Getting Static Data From DB

Since now there is a database, it is possible to dynamically create the 
pre-rendered pages taking the data from the database:
```javascript
// index.js
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
// [meetupId]/index.js
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
        fallback: false,
        paths: paths,
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
            meetup: meetup,
            revalidate: 60, // minimum amount of seconds
        },
    };
}

export default MeetupDetalilsPage;
```
All the imports that are part only on the backend, will not be part of the 
page served to the user.

## Page Metadata

It is possible to setup the medadata information for the page by using 
the `Head` component:
```javascript
// index.js
const HomePage = props => {
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
// new-meetup/index.js
const NewMeetupPage = () => {
    // ...
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
// [meetupId]/index.js
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
```


## Deploy

It is possible to build the project for production using:
```bash
npm run build
```
it is then possible to run the production server using
```bash
npm start
```

### Hosting

The hosting procedure changes depending from the host,
using [Vercel](https://vercel.com/) it is possible to just link 
the github repository and they will do everithing.


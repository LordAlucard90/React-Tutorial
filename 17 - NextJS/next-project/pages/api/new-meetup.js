import Database from 'better-sqlite3';

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

import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';

import db from './../db/firebase-db';


const router = Router();


router.get('/check', async (req: Request, res: Response) => {
    db.collection('Trophies').get()
    .then((snapshot: any) => {
        snapshot.forEach((doc: any) => {
            console.log(doc.id, '=>', doc.data());
        });
    })
    .catch((err: any) => {
        console.log('Error getting documents', err);
    })

    res.json({'message': 'Yoodles, babes. Yoodles!'})
});

export default router;

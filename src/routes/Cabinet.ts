import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { from } from 'rxjs';

import db from './../db/firebase-db';


const router = Router();


router.get('/check', async (req: Request, res: Response) => {
    from(db.collection('Trophies').get()).subscribe(
        (snapshot: any) => { console.log('SNAPSHOT!') },
        (error:    any) => { console.log('ERROR!') },
        ()              => { res.json({'message': 'COMPLETED!'})}
    )
});

export default router;

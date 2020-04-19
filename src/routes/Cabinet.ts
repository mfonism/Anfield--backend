import { Request, Response, Router } from 'express';
import { BAD_REQUEST, OK } from 'http-status-codes';
import { from } from 'rxjs';
import { first, map } from 'rxjs/operators';

import db from './../db/firebase-db';


const router = Router();


router.get('/check', async (req: Request, res: Response) => {

    from(db.collection('Trophies').get())
    .pipe(
        first(),
        map((snapshot: any) => {
            return snapshot.docs.reduce((acc: any, doc: any) => {
                acc.push(doc.data());
                return acc
            }, new Array())
        })
    )
    .subscribe(
        (data:  any) => { res.status(OK).json({'data': data})},
        (error: any) => { res.status(BAD_REQUEST).json({'error': error.message })}
    )
});

export default router;

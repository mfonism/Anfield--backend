import { Request, Response, Router } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { from } from 'rxjs';
import { first, map } from 'rxjs/operators';

import db from './../db/firebase-db';

const router = Router();


/**
 * Returns an array containing data from the documents in a snapshot.
 * The data in the returned array, for each document, contains the
 * `id` of the respective document.
 *
 * @param snapshot - The input snapshot
 */
function arraylizeSnapshot(snapshot: any) {
    return snapshot.docs
        .reduce((acc: any, doc: any) => {
            acc.push({'id': doc.id, ...doc.data()});
            return acc
        }, new Array())
}


router.get('/all', async (req: Request, res: Response) => {

    from(db.collection('Trophies').get())
    .pipe(
        first(),
        map((snapshot: any) => arraylizeSnapshot(snapshot))
    )
    .subscribe(
        (data:  any) => res.status(OK).json({'data': data}),
        (error: any) => res.status(BAD_REQUEST).json({'error': error.message})
    )

});


router.get('/:id', async (req: Request, res: Response) => {

    const { id } = req.params as ParamsDictionary;

    from(db.collection('Trophies').doc(id).get())
    .pipe(
        first(),
        map((snapshot: any) => { return snapshot.data() })
    )
    .subscribe(
        (data:  any) => { 
            if (data) {
                return res.status(OK).json({'data': data})
            } else {
                return res.status(NOT_FOUND).json({'error': 'Trophy not found!'})
            }
        },
        (error: any) => { res.status(BAD_REQUEST).json({'error': error.message }) }
    )
});

export default router;

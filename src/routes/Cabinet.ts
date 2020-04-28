import { Request, Response, Router } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { DocumentSnapshot, DocumentReference, QuerySnapshot } from '@firebase/firestore-types';
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from 'http-status-codes';
import { from, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import db from './../db/firebase-db';
import { paramMissingError } from '@shared/constants';

const router = Router();



/****************************************************************
*
*    CREATE -- POST  /api/trophies/add
*
*****************************************************************/

router.post('/add', async (req: Request, res: Response) => {
    
    const { place, tournament, year } = req.body;

    if (!place || !tournament || !year) {
        return res.status(BAD_REQUEST).json({'error': paramMissingError})
    }

    from<Observable<DocumentReference>>(db.collection('Trophies').add({
        'place': place, 'tournament': tournament, 'year': Number(year)
    }))
    .subscribe(
        (docRef: DocumentReference) => res.status(CREATED).json({
            'data': {
                'id': docRef.id,
                'place': place,
                'tournament': tournament,
                'year': Number(year)
            } 
        }),
        (error: any) => res.status(BAD_REQUEST).json({'error': error.message})
    )

})



/****************************************************************
*
*    RETRIEVE <all> -- GET  /api/trophies/all
*
*****************************************************************/

/**
 * Returns an array containing data from the documents in a snapshot.
 * The data in the returned array, for each document, contains the
 * `id` of the respective document.
 *
 * @param snapshot - The input snapshot
 */
function arraylizeSnapshot(snapshot: QuerySnapshot): Array<any> {
    return snapshot.docs
        .reduce((acc: Array<any>, doc: DocumentSnapshot) => {
            acc.push({'id': doc.id, ...doc.data()});
            return acc
        }, new Array<any>())
}


router.get('/all', async (req: Request, res: Response) => {

    from(db.collection('Trophies').get())
    .pipe(
        first<any, QuerySnapshot>(),
        map((snapshot: QuerySnapshot) => arraylizeSnapshot(snapshot))
    )
    .subscribe(
        (data: Array<any>) => res.status(OK).json({'data': data}),
        (error: any) => res.status(BAD_REQUEST).json({'error': error.message})
    )

});


router.get('/:id', async (req: Request, res: Response) => {

    const { id } = req.params as ParamsDictionary;

    from(db.collection('Trophies').doc(id).get())
    .pipe(
        first<any, DocumentSnapshot>(),
        map((snapshot: DocumentSnapshot) => snapshot.data())
    )
    .subscribe(
        (data:  any) =>
            data
            ? res.status(OK).json({'data': data})
            : res.status(NOT_FOUND).json({'error': 'Trophy not found!'}),
        (error: any) => res.status(BAD_REQUEST).json({'error': error.message })
    )

});

export default router;

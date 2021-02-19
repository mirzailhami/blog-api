import * as functions from 'firebase-functions';
import * as express from 'express';

const cors = require('cors')({origin: true});
const api = express(); api.use(cors);
const router = express.Router();

const mailjet = require ('node-mailjet').connect(functions.config().mailjet.public_key, functions.config().mailjet.private_key);

router.post('/subscribe', async (req: any, res) => {
    try {
        if (!req.body.email) throw {code: 403, message: '⚠️ Email is required'};

        const result = await mailjet
            .post("contactslist", {'version': 'v3'})
            .id(15139)
            .action("managecontact")
            .request({
                Action: "addforce",
                Email: req.body.email
            });

        res.status(200).send(result.body);
    } catch (error) {
        res.status(isNaN(error.code) ? 401 : error.code).send(error);
    }
});

api.use('/v1', router);

exports.api = functions.runWith({timeoutSeconds: 120, memory: '2GB'}).https.onRequest(api);
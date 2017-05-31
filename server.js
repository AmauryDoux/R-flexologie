"use strict";

const
    express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    port = process.env.PORT || 3000;

app
    .use(express.static('public'))
    .use('/admin', express.static('admin'))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json());

mongoose.connect('mongodb://localhost/bdd');

const
    RdvShema = mongoose.Schema({
        jour: String,
        heureStart: String,
        heureEnd: String,
        patient: {
            nom: String,
            prenom: String,
            email: String,
            tel: String,
            adresse: String,
            commentaire: String
        },
        status: Number
    }),
    Rdv = mongoose.model('Rdv', RdvShema),
    router = express.Router();

router
    .route('/')
    .get(function (req, res) {
        Rdv.find(function (err, rdv) {
            if (err) {
                res.send(err);
            }
            res.json({ rdv });
        });
    })
    .post(function (req, res) {
        var rdv = new Rdv();
        rdv.jour = req.body.jour;
        rdv.heureStart = req.body.heureStart;
        rdv.heureEnd = req.body.heureEnd;
        rdv.patient.nom = req.body.patient.nom;
        rdv.patient.prenom = req.body.patient.prenom;
        rdv.patient.email = req.body.patient.email;
        rdv.patient.tel = req.body.patient.tel;
        rdv.patient.adresse = req.body.patient.adresse;
        rdv.patient.commentaire = req.body.patient.commentaire;
        rdv.status = req.body.status;
        rdv.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.send({ message: 'Rdv created' });
            console.log("j'ai envoie")
        })
    });


router
    .route('/:rdv_id')
    .get(function (req, res) {
        Rdv.findOne({ _id: req.params.rdv_id }, function (err, rdv) {
            if (err) {
                res.send(err);
            }
            res.json({ rdv });
        });
    })
    .put(function (req, res) {
        Rdv.findOne({ _id: req.params.rdv_id }, function (err, rdv) {
            if (err) {
                res.send(err);
            }
            rdv.jour = req.body.jour;
            rdv.heureStart = req.body.heureStart;
            rdv.heureEnd = req.body.heureEnd;
            rdv.patient.nom = req.body.patient.nom;
            rdv.patient.prenom = req.body.patient.prenom;
            rdv.patient.email = req.body.patient.email;
            rdv.patient.tel = req.body.patient.tel;
            rdv.patient.adresse = req.body.patient.adresse;
            rdv.patient.commentaire = req.body.patient.commentaire;
            rdv.status = req.body.status;

            rdv.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.send({ message: 'Rdv update' });
            });
        });
    })
    .delete(function (req, res) {
        Rdv.remove({ _id: req.params.rdv_id }, function (err) {
            if (err) {
                res.send(err);
            }
            res.send({ message: 'Rdv deleted' });
        });
    });


app.use("/rdv", router);

const
    RdvJourShema = mongoose.Schema({
        jour: String,
        heureStart: String,
        heureEnd: String
    }),
    RdvJour = mongoose.model('RdvJour', RdvJourShema),
    routed = express.Router();

routed
    .route('/')
    .get(function (req, res) {
        RdvJour.find(function (err, rdv) {
            if (err) {
                res.send(err);
            }
            res.json({ rdv });
        });
    })
    .post(function (req, res) {
        var rdv = new RdvJour();
        rdv.jour = req.body.jour;
        rdv.heureStart = req.body.heureStart;
        rdv.heureEnd = req.body.heureEnd;
        rdv.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.send({ message: 'jour et heure created' });
        })
    });

routed
    .route('/:rdv_id')
    .get(function (req, res) {
        RdvJour.findOne({ _id: req.params.rdv_id }, function (err, rdv) {
            if (err) {
                res.send(err);
            }
            res.json({ rdv });
        });
    })
    .put(function (req, res) {
        RdvJour.findOne({ _id: req.params.rdv_id }, function (err, rdv) {
            if (err) {
                res.send(err);
            }
            rdv.jour = req.body.jour;
            rdv.heureStart = req.body.heureStart;
            rdv.heureEnd = req.body.heureEnd;

            rdv.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.send({ message: 'Rdv update' });
            });
        });
    })
    .delete(function (req, res) {
        Rdv.remove({ _id: req.params.rdv_id }, function (err) {
            if (err) {
                res.send(err);
            }
            res.send({ message: 'Rdv deleted' });
        });
    });


app.use("/RdvJour", routed);


app.listen(port, function () {
    console.log("Adresse du serveur : http://localhost:3000");
}); 
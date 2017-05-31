"use strict";

const
    express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    nodemailer = require('nodemailer'),
    xoauth2 = require('xoauth2'),
    mongoose = require('mongoose'),
    port = process.env.PORT || 3000;

app
    .all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
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



//Envoie de mail a La validation 
app.post('/sendmailVal', function (req, res) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'alienodev@gmail.com>',
            pass: 'WildAlieno'
        }
    })
    var mailOptions = {
        from: 'Alieno<alienodev@gmail.com>',
        to: req.body.patient.email,
        subject: 'Rendez vous validé',
        text: 'Bonjour,  je vous confirme votre rendez vous le ' + req.body.jour + ' de ' + req.body.heureStart + ' h  à ' + req.body.heureEnd + ' H'
    }
    transporter.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email Sent');
        }
    })
    res.send({ message: 'Rdv created' });

});

//Envoi email annulation
app.post('/sendmailSupr', function (req, res) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'alienodev@gmail.com',
            pass: 'WildAlieno'
        }
    })
    var mailOptions = {
        from: 'Alieno<alienodev@gmail.com>',
        to: req.body.patient.email,
        subject: 'Rendez vous annulé',
        text: 'je suis un texte invisible',
        html: '<h1>hello</h1>'
    }
    transporter.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email Sent');
        }
    })
    res.send({ message: 'Rdv created' });

});
//Envoie email enregistrement du patient
app.post('/sendmail', function (req, res) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'alienodev@gmail.com>',
            pass: 'WildAlieno'
        }
    })
    var mailOptions = {
        from: 'Alieno<alienodev@gmail.com>',
        to: req.body.patient.email + ', alienodev@gmail.com>',
        subject: 'Rendez vous',
        text: 'Bonjour, vous avez pris un rendez-vous le' + req.body.jour + 'a ' + req.body.heureStart + 'h , à l\'adresse : ' + req.body.patient.adresse + 'Je reviendrais vers vous pour vous confirmer votre rendez vous'
    }
    transporter.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email Sent');
        }
    })
    res.send({ message: 'Rdv created' });

});
app.listen(port, function () {
    console.log("Adresse du serveur : http://localhost:3000");
}); 
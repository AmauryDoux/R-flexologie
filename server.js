"use strict";
//Requiere
const
    express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    nodemailer = require('nodemailer'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    port = process.env.PORT || 3000,
    path = require('path');

// Utilisation de app, c'est a dire d'express
// Important: il faut que l'ordre des middleware(s) suivants soit respecté.
app
    .all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(express.static('public'))
    .use('/auth', express.static('auth'))
    .use(session({
        secret: 'TheAliensAreAmongUs', // secret word to create the hash
        resave: false, // If true, it forces the session to be saved back to the session store
        saveUninitialized: false // If true, it forces a session that is "uninitialized" to be saved to the store
    }))
    .all("/admin/*", requireLogin, function(req, res, next) {
        next(); // if the middleware requireLogin allowed us to get here,
                // just move on to the next route handler
    })
    .use('/admin', express.static('admin'));

//On se connect à mongodb
mongoose.connect('mongodb://localhost/bdd');

//Création du shema
const
    RdvSchema = mongoose.Schema({
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
    //Utilisation du schema sur  Rdv
    Rdv = mongoose.model('Rdv', RdvSchema),
    //instancation de la route router
    router = express.Router();
//router --> Api
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
            console.log("hello");
            res.send({ message: 'Rdv deleted' });
        });
    });

//chemin
app.use("/rdv", router);


//Nouveau schema
const
    RdvJourSchema = mongoose.Schema({
        jour: String,
        heureStart: String,
        heureEnd: String
    }),
    RdvJour = mongoose.model('RdvJour', RdvJourSchema),
    routed = express.Router();


//API routed
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
        rdv.title = req.body.title;
        rdv.start = req.body.start;
        rdv.end = req.body.end;
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
            rdv.title = req.body.title;
            rdv.start = req.body.start;
            rdv.end = req.body.end;

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
            user: 'alienodev@gmail.com',
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
            user: 'alienodev@gmail.com',
            pass: 'WildAlieno'
        }
    })
    var mailOptions = {
        from: 'Alieno<alienodev@gmail.com>',
        to: req.body.patient.email + ', alienodev@gmail.com',
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
     //**********************************************//
    //                                              //
   //        LA PLACE POUR AUTHENTIFICATION        //
  //          DE MASS                             //
 //                                              //
//**********************************************//

// Just temporarly we are going to utilise the module *express-session* .
// But, since this might be dangerous, we will use PASSPORT.
// var mySession = {};

app.get('/auth', function(req, res) {
	// console.log(__dirname);
    res.sendFile(path.join(__dirname + '/auth/index.html'));
});

app.post('/auth', function(req, res) {

    if (req.body.uname && req.body.psw) {
    	console.log("pair of values received!");
    	if (req.body.uname === 'Ernesto' && req.body.psw === 'Guevara') {
            req.session.authenticated = true;
		}
	} else {
		console.log("User name and/or password undefined or incorrect");
	}

    res.redirect('/redirects');
});

app.get('/redirects', function(req, res) {
    if (req.session.authenticated) {
    	console.log('You are in!');
        res.redirect('/admin');
    } else {
        // res.end('Who are you?!');
	    res.send('<script>\
                    alert("Nom d\'utilisateur et/ou Mot de passe incorrect(s).");\
                    window.location.replace("http://localhost:3000/auth");\
                </script>');
    }
});

app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
		// console.log(err);
		res.redirect('/auth');
        console.log("You've been logout");
	});
});

// The following "requireLogin" middleware protects a particular
// route(s), in our case /admin/*, from being accessed
function requireLogin(req, res, next) {
    if (req.session.authenticated) {
        next(); // allow the next route to run
    } else {
        // require the user to log in
        res.redirect("/auth"); // or render a form, etc.
    }
}

//On finit avec un beau listen
app.listen(port, function () {
    console.log("Adresse du serveur : http://localhost:" + port);
});

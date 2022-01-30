let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignment = require('./routes/assignments');
let utilisateur = require('./routes/utilisateurs');
let mongoose = require('mongoose');
const verifyToken = require("./middleware/auth");
require('dotenv').config()
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
const uri = 'mongodb+srv://testWasTaken:testWasTaken@clustermiage.jpocj.mongodb.net/assignmentApp?retryWrites=true&w=majority';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:8010/api/assignments que cela fonctionne")
    console.log("vérifiez with http://localhost:8010/api/utilisateurs que cela fonctionne")
    },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

app.route(prefix + '/utilisateurs')
    .get(utilisateur.getUtilisateurs)
    .post(utilisateur.logIn);


app.route(prefix + '/assignments')
    .get(assignment.getAssignments)
    .post(assignment.postAssignment)
    .put(assignment.updateAssignment);

app.route(prefix + '/assignments/:id')
    .get(assignment.getAssignment)
    .delete(assignment.deleteAssignment);
/*
ExpRouter.get('/assignments', verifyToken, assignment.getAssignments)
ExpRouter.post('/assignments', verifyToken, assignment.postAssignment)
ExpRouter.put('/assignments', verifyToken, assignment.updateAssignment)


ExpRouter.get('/assignments/:id', verifyToken, assignment.getAssignment)
ExpRouter.delete('/assignments/:id', verifyToken, assignment.deleteAssignment)
 */


// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;



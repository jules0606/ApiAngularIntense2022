let Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET)
/*
function getAssignments(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}
*/
// Récupérer tous les assignments (GET)

function getAssignments(req, res) {
    var aggregateQuery = Assignment.aggregate();
    if(req.query.onlyRendu === "true" && req.query.nomDevoir && req.query.nomDevoir !== '') {
        aggregateQuery = Assignment.aggregate([{ $match: { rendu: true}}, { $match: {"nom" : {$regex : ".*"+req.query.nomDevoir +".*"}}}]);
    }
    else if(req.query.onlyRendu === "true") {
        aggregateQuery = Assignment.aggregate([{ $match: { rendu: true}}]);
    }
    else if(req.query.nomDevoir && req.query.nomDevoir !== '') {
        aggregateQuery = Assignment.aggregate([{ $match: {"nom" : {$regex : ".*"+req.query.nomDevoir +".*"}}}]);
    }
    Assignment.aggregatePaginate(aggregateQuery,
      {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      },
      (err, assignments) => {
        if (err) {
          res.send(err);
        }
        res.send(assignments);
      }
    );
   }
   
// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    Assignment.findById(req.params.id, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;
    assignment.note = -1;
    assignment.matiere = req.body.matiere;
    assignment.auteur = req.body.auteur;
    assignment.remarques = req.body.remarques;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.status(509).send('cant post assignment ', err);
        }
        res.json(assignment);
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'updated'})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };

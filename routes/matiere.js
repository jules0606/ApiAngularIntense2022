let Matiere = require('../model/matiere');

function getMatieres(req, res) {
    Matiere.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}


module.exports = { getMatieres };
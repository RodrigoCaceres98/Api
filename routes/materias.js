var express = require("express");
var router = express.Router();
var models = require("../models");


router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  // //pagina que quiero ver
  // const pagina = Number.parseInt(req.query.pagina);
  // //cantidad de elentos por pagina
  // const cantidad = Number.parseInt(req.query.cantidad);

  models.materia
    .findAll({
      attributes: ["id", "nombre", "id_carrera", "id_profesor"],
      // // limitacion de paginado
      // limit: cantidad,
      // //para ubicar pagina
      // offset: pagina * cantidad,
    })
    .then((materias) => res.send(materias))
    .catch(() => res.sendStatus(500));
});




router.post("/", (req, res) => {
  console.log("Ingreso de materia");
  models.materia
    .create({ nombre: req.body.nombre, id_carrera: req.body.id_profesor })
    .then((materia) => res.status(201).send({ id: materia.id }))
    .catch((error) => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res
          .status(400)
          .send("Bad request: existe otra materia con el mismo nombre");
      } else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`);
        res.sendStatus(500);
      }
    });
});


const findCarrera = (id, { onSuccess, onNotFound, onError }) => {
  models.materia
    .findOne({
      attributes: ["id", "nombre"],
      where: { id }
    })
    .then(materia => (materia ? onSuccess(materia) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findCarrera(req.params.id, {
    onSuccess: materia => res.send(materia),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = materia =>
    materia
      .update({ nombre: req.body.nombre }, { fields: ["nombre"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra materia con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = materia =>
    materia
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;

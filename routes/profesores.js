var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {

    // const pagina = Number.parseInt(req.query.pagina);
    // const cantidad = Number.parseInt(req.query.cantidad);

    // console.log(
    //     "Pagina número " +
    //     pagina +
    //     ", Cantidad de profesores por página " +
    //     cantidad
    // );
    models.profesores
        .findAll({
            attributes: ["id", "nombre", "dni"],
            // limit: cantidad,
            // offset: pagina * cantidad,
        })
        .then((profesores) => res.send(profesores))
        .catch(() => res.sendStatus(500));
});

// PROFESORES CON MATERIAS
router.get("/materias", (req, res) => {
    console.log("Profesores con materias");
    models.profesores
        .findAll({
            attributes: ["id", "nombre", "dni"],
            include: [
                {
                    model: models.materia,
                    as: "Profesor-Relacionado",
                    attributes: ["nombre"],
                },
            ],
        })
        .then((profesores) => res.send(profesores))
        .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
    console.log("Ingreso de profesor");
    models.profesores
        .create({ nombre: req.body.nombre, dni: req.body.dni })
        .then((profesores) => res.status(201).send({ id: profesores.id }))
        .catch((error) => {
            if (error == "SequelizeUniqueConstraintError: Validation error") {
                res
                    .status(400)
                    .send("Bad request: existe otro profesor con el mismo dni");
            } else {
                console.log(`Error al intentar insertar en la base de datos: ${error}`);
                res.sendStatus(500);
            }
        });
});

const findProfesor = (id, { onSuccess, onNotFound, onError }) => {
    models.profesores
        .findOne({
            attributes: ["id", "nombre", "dni"],
            where: { id },
            include: [
                {
                    model: models.materia,
                    as: "materias-de-profesor",
                    attributes: ["nombre"],
                },
            ],
        })
        .then((profesores) => (profesor ? onSuccess(profesores) : onNotFound()))
        .catch(() => onError());
};

router.get("/:id", (req, res) => {
    console.log("Busqueda de profesor por id");
    findProfesor(req.params.id, {
        onSuccess: (profesores) => res.send(profesores),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500),
    });
});

router.put("/:id", (req, res) => {
    console.log("Actualizacion de profesor");
    const onSuccess = (profesores) =>
        profesores
            .update(
                { nombre: req.body.nombre, dni: req.body.dni },
                { fields: ["nombre", "dni"] }
            )
            .then(() => res.sendStatus(200))
            .catch((error) => {
                if (error == "SequelizeUniqueConstraintError: Validation error") {
                    res
                        .status(400)
                        .send("Bad request: existe otro profesor con el mismo dni");
                } else {
                    console.log(
                        `Error al intentar actualizar la base de datos: ${error}`
                    );
                    res.sendStatus(500);
                }
            });
    findProfesor(req.params.id, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500),
    });
});

router.delete("/:id", (req, res) => {
    console.log("Eliminacion de profesor");
    const onSuccess = (profesores) =>
        profesores
            .destroy()
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(500));
    findProfesor(req.params.id, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500),
    });
});

module.exports = router;
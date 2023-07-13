'use strict';
module.exports = (sequelize, DataTypes) => {
  const inscripciones = sequelize.define('inscripciones', {
    fecha: DataTypes.STRING,
    id_materia: DataTypes.INTEGER,
    id_alumno: DataTypes.INTEGER
  }, {});
  inscripciones.associate = function(models) {
    // associations can be defined here
  };
  return inscripciones;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  const alumno = sequelize.define('alumnos', {
    nombre: DataTypes.STRING,
    dni: DataTypes.STRING
  }, {});
  alumno.associate = function(models) {
    // associations can be defined here
  };
  return alumno;
};
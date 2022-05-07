const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // console.log(sequelize)
  // defino el modelo
  sequelize.define('dog', {
    
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          is:  {
            args: /^[a-zA-Z\s]*$/,  // verifica solo el uso de letras y espacios
            msg: 'Debe contener sólo letras y espacios'
          } 
      },
    },

    heightMin : { 
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          args: true,
          msg: 'Must contain a number greater than 0',
          min: 0    // Solo permite valores positivos
        },
        /*  Verifica que la altura mínima no sea mayor a la máxima */
        isGreater(value) {  
          if (parseInt(value) >= parseInt(this.heightMax)) {
            throw new Error('Height Min cannot be greater than Height Max');
            }
          },
      },
      allowNull: false,
    },

    heightMax : { 
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          args: true,
          msg: 'Must be contains a number greater than 0',
          min: 0  // Solo permite valores positivos
        },
        isLower(value) {  //  Verifica que la altura mínima no sea mayor a la máxima
          if (parseInt(value) <= parseInt(this.heightMin)) {
            throw new Error('Height Min cannot be greater than Height Max');
            }
          },
      },
      allowNull: false,
    },

    weightMin : {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          args: true,
          msg: 'Must be contains a number greater than 0',
          min: 0  // Solo permite valores positivos
        },
        isGreater(value) {  //  Verifica que el peso mínimo no sea mayor al máximo
          if (parseInt(value) >= parseInt(this.weightMax)) {
            throw new Error('Weight Min cannot be greater than Weight Max');
            }
          },
        min: 0  // Solo permite valores positivos
      },
      allowNull: false,
    },

    weightMax : {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          args: true,
          msg: 'Must be contains a number greater than 0',
          min: 0  // Solo permite valores positivos
        },
        isLower(value) {  //  Verifica que el peso mínimo no sea mayor al máximo
          if (parseInt(value) <= parseInt(this.weightMin)) {
            throw new Error('Weight Min cannot be greater than Weight Max');
            }
          },
      },
      allowNull: false,
    },

    life_span: {
      type: DataTypes.STRING(20),
      defaultValue: "???"
    },

    image: {
      type: DataTypes.STRING(2500),
      validate: {
        is:{ 
          args: /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
          msg: 'Enter a valid URL',
        }
      },
      allowNull: true,
    },
    
  },
  {
    timestamps: false,
  }
  );
};

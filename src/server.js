// src/server.js
// Punto de entrada del servidor. Levanta la aplicación Express y sincroniza Sequelize.

const config = require('./config/env');
const app = require('./app');
const db = require('./models'); // Importa { sequelize, Sequelize }

async function startServer() {
  try {
    // Se prueba la conexión a la base de datos
    await db.sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Sincroniza los modelos con la base de datos.
    // En entorno de desarrollo se puede usar alter: true para ajustar el esquema.
    await db.sequelize.sync({ alter: true });
    console.log('Modelos sincronizados con la base de datos.');

    const port = config.port;

    app.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
}

startServer();

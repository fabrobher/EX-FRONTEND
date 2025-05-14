// This is a new file for solution!
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Performances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      group: {
        allowNull: false,
        type: Sequelize.STRING
      },
      appointment: {
        allowNull: false,
        type: Sequelize.DATE
      },
      restaurantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Restaurants'
          },
          key: 'id'
        },
        onDelete: 'cascade'
      },      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }  
    })
  },

  down: async (queryInterface, Sequelize)  => {
    await queryInterface.dropTable('Performances')
  }
};

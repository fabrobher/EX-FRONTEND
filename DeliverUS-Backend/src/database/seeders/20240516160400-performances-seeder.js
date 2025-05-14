module.exports = {
    up: async (queryInterface, Sequelize) => {
      /**
       * Add seed commands here.
       *
       * Example:
       * await queryInterface.bulkInsert('People', [{
       *   name: 'John Doe',
       *   isBetaMember: false
       * }], {})
      */
      const beforeNow = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      beforeNow.setHours(0,0,0,0) 
      const today = new Date(Date.now())
      today.setHours(0,0,0,0)
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
      tomorrow.setHours(0,0,0,0)
      const tomorrowPast = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      tomorrowPast.setHours(0,0,0,0)
      const futureNow = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      futureNow.setHours(0,0,0,0)  

      await queryInterface.bulkInsert('Performances',
        [
          { group: 'Iron Maiden', appointment: beforeNow , restaurantId: 1 },
          { group: 'Then Rolling Stones', appointment: today , restaurantId: 1 },
          { group: 'La Pantoja', appointment: tomorrow, restaurantId: 1 },
          { group: 'Nebulossa' , appointment: futureNow, restaurantId: 1},
          { group: 'No me pises que llevo chanclas' , appointment: beforeNow, restaurantId: 2},
          { group: 'AC/DC', appointment: tomorrow, restaurantId: 2},
          { group: 'Chikilicuatre', appointment: tomorrowPast, restaurantId: 2}
        ], {})
    },
  
    down: async (queryInterface, Sequelize) => {
      /**
       * Add commands to revert seed here.
       *
       * Example:
       * await queryInterface.bulkDelete('People', null, {})
       */
  
      const { sequelize } = queryInterface
      try {
        await sequelize.transaction(async (transaction) => {
          const options = { transaction }
          await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', options)
          await sequelize.query('TRUNCATE TABLE ProductCategories', options)
          await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options)
        })
      } catch (error) {
        console.error(error)
      }
    }
  }
  
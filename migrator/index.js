const m = require('mongodb');
const uuidv4 = require('uuid/v4');
const { Client } = require('pg');
const pg = new Client({
  user: 'tukki',
  password: 'ABC',
  host: 'localhost',
  database: 'Makro',
  port: 5432
});

pg.connect()
  .then(() => {
    m.connect('mongodb://localhost:27017/makro', (err, db) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      console.log('Connected to databases');

      const database = db.db('makro');

      const userCollection = database.collection('users');
      const articleCollection = database.collection('articles');
      const commentsCollection = database.collection('comments');
      const daysCollection = database.collection('days');
      const editedfoodsCollection = database.collection('editedfoods');
      const feedbacksCollection = database.collection('feedbacks');
      const foodsCollection = database.collection('foods');
      const questionsCollection = database.collection('questions');
      const shareddaysCollection = database.collection('shareddays');
      const sharedmealsCollection = database.collection('sharedmeals');
      const votesCollection = database.collection('votes');
      let cursor = userCollection.find({});

      cursor.forEach(u => {
        console.log(u);
        u.showTargets = true;
        if (!u.createdAt) {
          u.createdAt = new Date();
        }

        if (!u.updatedAt) {
          u.updatedAt = new Date();
        }

        if (!u.lastLogin) {
          u.lastLogin = new Date();
        }

        if (!u.userAddedExpenditure) {
          u.userAddedExpenditure = 0;
        }

        if (!u.userAddedProteinTarget) {
          u.userAddedProteinTarget = 0;
        }

        if (!u.userAddedFatTarget) {
          u.userAddedFatTarget = 0;
        }

        if (!u.userAddedCarbTarget) {
          u.userAddedCarbTarget = 0;
        }
        const text =
          'INSERT INTO "Users"("UUID", "Username", "Email", "Age", "Height", "Weight", "Activity", "Sex", "DailyExpenditure", "UserAddedExpenditure", "UserAddedProteinTarget", "UserAddedCarbTarget", "UserAddedFatTarget", "LastLogin", "Roles", "ShowTargets", "CreatedAt", "UpdatedAt", "Password") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *';
        const values = [
          u._id.toString(),
          u.username,
          u.email,
          u.age,
          u.height,
          u.weight,
          u.activity,
          u.sex,
          u.dailyExpenditure,
          u.userAddedExpenditure,
          u.userAddedProteinTarget,
          u.userAddedCarbTarget,
          u.userAddedFatTarget,
          u.lastLogin,
          [u.role],
          u.showTargets,
          u.createdAt,
          u.updatedAt,
          u.password
        ];
        pg.query(text, values)
          .then(res => {
            u.meals.forEach(m => {
              const uuid = uuidv4();
              const d = new Date();
              const q = 'INSERT INTO "MealNames"("UUID", "UserId", "Name", "CreatedAt", "UpdatedAt") VALUES($1, $2, $3, $4, $5)';
              const v = [uuid, res.rows[0].Id, m.name, d, d];
              pg.query(q, v).catch(error => {
                console.log(error);
                process.exit(1);
              });
            });
          })
          .catch(e => {
            console.log(e);
            process.exit(1);
          });
      });

      // cursor = articleCollection.find({});
      // cursor.forEach(e => articles.push(e));

      // cursor = commentsCollection.find({});
      // cursor.forEach(e => comments.push(e));

      // cursor = daysCollection.find({});
      // cursor.forEach(e => days.push(e));

      // cursor = editedfoodsCollection.find({});
      // cursor.forEach(e => editedfoods.push(e));

      // cursor = feedbacksCollection.find({});
      // cursor.forEach(e => feedbacks.push(e));

      // cursor = foodsCollection.find({});
      // cursor.forEach(e => foods.push(e));

      // cursor = questionsCollection.find({});
      // cursor.forEach(e => questions.push(e));

      // cursor = shareddaysCollection.find({});
      // cursor.forEach(e => shareddays.push(e));

      // cursor = sharedmealsCollection.find({});
      // cursor.forEach(e => sharedmeals.push(e));

      // cursor = votesCollection.find({});
      // cursor.forEach(e => votes.push(e));
    });
  })
  .catch(pgerror => {
    console.log(pgerror);
    process.exit(1);
  });

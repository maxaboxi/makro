const mongodb = require('mongodb');
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
    mongodb.connect('mongodb://localhost:27017/makro', { useNewUrlParser: true }, (err, db) => {
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
      const answersCollection = database.collection('answers');
      const shareddaysCollection = database.collection('shareddays');
      const sharedmealsCollection = database.collection('sharedmeals');
      const votesCollection = database.collection('votes');

      let cursor = userCollection.find({});
      // addUsers(cursor);

      // setTimeout(() => {
      //   cursor = foodsCollection.find({});
      //   addFoods(cursor);
      // }, 1000);

      // setTimeout(() => {
      //   cursor = daysCollection.find({});
      //   addDays(cursor);
      // }, 2000);

      // setTimeout(() => {
      //   cursor = shareddaysCollection.find({});
      //   addSharedDays(cursor);
      // }, 3000);

      // setTimeout(() => {
      //   cursor = sharedmealsCollection.find({});
      //   addSharedMeals(cursor);
      // }, 4000);

      // setTimeout(() => {
      //   cursor = articleCollection.find({});
      //   addArticles(cursor);
      // }, 5000);

      // setTimeout(() => {
      //   cursor = questionsCollection.find({});
      //   addQuestions(cursor);
      // }, 6000);

      // setTimeout(() => {
      //   cursor = answersCollection.find({});
      //   addAnswers(cursor);
      // }, 7000);

      // setTimeout(() => {
      //   cursor = commentsCollection.find({});
      //   addComments(cursor);
      // }, 8000);

      cursor = commentsCollection.find({});
      addComments(cursor);

      // cursor = editedfoodsCollection.find({});
      // cursor.forEach(e => editedfoods.push(e));

      // cursor = feedbacksCollection.find({});
      // cursor.forEach(e => feedbacks.push(e));

      // cursor = votesCollection.find({});
      // cursor.forEach(e => votes.push(e));
    });
  })
  .catch(pgerror => {
    console.log(pgerror);
    process.exit(1);
  });

function addUsers(cursor) {
  console.log('Starting to migrate users');
  cursor.forEach(u => {
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
}

function addFoods(cursor) {
  console.log('Starting to migrate foods');
  cursor.forEach(e => {
    if (!e.createdAt) {
      e.createdAt = new Date();
    }

    if (!e.updatedAt) {
      e.updatedAt = new Date();
    }

    if (!e.kuitu) {
      e.kuitu = 0;
    }

    if (!e.sokeri) {
      e.sokeri = 0;
    }
    const userQuery = 'SELECT "Id" FROM "Users" WHERE "Username" = $1';
    const userValues = [e.username];
    pg.query(userQuery, userValues)
      .then(res => {
        let userId;
        if (res.rows.length == 0) {
          userId = 1;
        } else {
          userId = res.rows[0].Id;
        }
        const text =
          'INSERT INTO "Foods"("UUID", "UserId", "Name", "Energy", "Protein", "Carbs", "Fat", "Sugar", "Fiber", "PackageSize", "ServingSize", "En", "CreatedAt", "UpdatedAt") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *';
        const values = [
          e._id.toString(),
          userId,
          e.name,
          e.energia,
          e.proteiini,
          e.hh,
          e.rasva,
          e.sokeri,
          e.kuitu,
          e.packageSize,
          e.servingSize,
          e.en,
          e.createdAt,
          e.updatedAt
        ];
        pg.query(text, values).catch(error => {
          console.log(error);
          process.exit(0);
        });
      })
      .catch(err => {
        console.log(err);
        process.exit(1);
      });
  });
}

function addDays(cursor) {
  console.log('Starting to migrate days');
  cursor.forEach(e => {
    if (!e.createdAt) {
      e.createdAt = new Date();
    }

    if (!e.updatedAt) {
      e.updatedAt = new Date();
    }

    const userQuery = 'SELECT "Id" FROM "Users" WHERE "Username" = $1';
    const userValues = [e.username];
    pg.query(userQuery, userValues)
      .then(res => {
        let userId;
        if (res.rows.length == 0) {
          userId = 1;
        } else {
          userId = res.rows[0].Id;
        }
        const text = 'INSERT INTO "Days"("UUID", "UserId", "Name", "CreatedAt", "UpdatedAt") VALUES($1, $2, $3, $4, $5) RETURNING *';
        const values = [e._id.toString(), userId, e.name, e.createdAt, e.updatedAt];
        pg.query(text, values)
          .then(resp => {
            const dayId = resp.rows[0].Id;
            e.meals.forEach(meal => {
              const uuid = uuidv4();
              const d = new Date();
              const q =
                'INSERT INTO "Meals"("UUID", "UserId", "DayId", "Name", "CreatedAt", "UpdatedAt") VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
              const v = [uuid, userId, dayId, meal.name, e.createdAt, e.updatedAt];
              pg.query(q, v)
                .then(re => {
                  const mealId = re.rows[0].Id;
                  meal.foods.forEach(f => {
                    const q = 'SELECT "Id" FROM "Foods" WHERE "Name" = $1';
                    const v = [f.name];
                    pg.query(q, v)
                      .then(r => {
                        if (r.rows.length !== 0) {
                          const foodId = r.rows[0].Id;
                          const q = 'INSERT INTO "MealFoods"("MealId", "FoodId") VALUES($1, $2)';
                          const v = [mealId, foodId];
                          pg.query(q, v).catch(error => {
                            console.log(error);
                            process.exit(1);
                          });
                        }
                      })
                      .catch(e => {
                        console.log(e);
                        process.exit(1);
                      });
                  });
                })
                .catch(error => {
                  console.log(error);
                  process.exit(1);
                });
            });
          })
          .catch(error => {
            console.log(error);
            process.exit(1);
          });
      })
      .catch(error => {
        console.log(error);
        process.exit(1);
      });
  });
}

function addSharedDays(cursor) {
  console.log('Starting to migrate shared days');
  cursor.forEach(e => {
    if (!e.createdAt) {
      e.createdAt = new Date();
    }

    if (!e.updatedAt) {
      e.updatedAt = new Date();
    }

    const userQuery = 'SELECT "Id" FROM "Users" WHERE "Username" = $1';
    const userValues = [e.username];
    pg.query(userQuery, userValues)
      .then(res => {
        let userId;
        if (res.rows.length == 0) {
          userId = 1;
        } else {
          userId = res.rows[0].Id;
        }
        const text = 'INSERT INTO "SharedDays"("UUID", "UserId", "CreatedAt", "UpdatedAt") VALUES($1, $2, $3, $4) RETURNING *';
        const values = [e._id.toString(), userId, e.createdAt, e.updatedAt];
        pg.query(text, values)
          .then(res => {
            const dayId = res.rows[0].Id;
            e.meals.forEach(meal => {
              if (meal.foods && meal.foods.length > 0) {
                const uuid = uuidv4();
                const d = new Date();
                const q =
                  'INSERT INTO "Meals"("UUID", "UserId", "SharedDayId", "Name", "CreatedAt", "UpdatedAt") VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
                const v = [uuid, userId, dayId, meal.name, e.createdAt, e.updatedAt];
                pg.query(q, v)
                  .then(re => {
                    const mealId = re.rows[0].Id;
                    meal.foods.forEach(f => {
                      const q = 'SELECT "Id" FROM "Foods" WHERE "Name" = $1';
                      const v = [f.name];
                      pg.query(q, v)
                        .then(r => {
                          if (r.rows.length !== 0) {
                            const foodId = r.rows[0].Id;
                            const q = 'INSERT INTO "MealFoods"("MealId", "FoodId") VALUES($1, $2)';
                            const v = [mealId, foodId];
                            pg.query(q, v).catch(error => {
                              console.log(error);
                              process.exit(1);
                            });
                          }
                        })
                        .catch(e => {
                          console.log(e);
                          process.exit(1);
                        });
                    });
                  })
                  .catch(error => {
                    console.log(error);
                    process.exit(1);
                  });
              }
            });
          })
          .catch(error => {
            console.log(e);
            console.log(error);
            process.exit(1);
          });
      })
      .catch(e => {
        console.log(e);
        process.exit(1);
      });
  });
}

function addSharedMeals(cursor) {
  console.log('Starting to migrate shared meals');
  cursor.forEach(e => {
    if (!e.createdAt) {
      e.createdAt = new Date();
    }

    if (!e.updatedAt) {
      e.updatedAt = new Date();
    }

    const userQuery = 'SELECT "Id" FROM "Users" WHERE "Username" = $1';
    const userValues = [e.username];
    pg.query(userQuery, userValues)
      .then(res => {
        let userId;
        if (res.rows.length == 0) {
          userId = 1;
        } else {
          userId = res.rows[0].Id;
        }
        const uuid = uuidv4();
        const d = new Date();
        const t =
          'INSERT INTO "SharedMeals"("UUID", "UserId","Name", "Info", "Recipe", "Tags", "CreatedAt", "UpdatedAt") VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
        const v = [e._id.toString(), userId, e.name, e.info, e.recipe, e.tags, e.createdAt, e.updatedAt];
        pg.query(t, v)
          .then(res => {
            const mealId = res.rows[0].Id;
            e.foods.forEach(f => {
              const q = 'SELECT "Id" FROM "Foods" WHERE "Name" = $1';
              const v = [f.name];
              pg.query(q, v)
                .then(r => {
                  if (r.rows.length !== 0) {
                    const foodId = r.rows[0].Id;
                    const q = 'INSERT INTO "MealFoods"("MealId", "FoodId") VALUES($1, $2)';
                    const v = [mealId, foodId];
                    pg.query(q, v).catch(error => {
                      console.log(error);
                      process.exit(1);
                    });
                  }
                })
                .catch(e => {
                  console.log(e);
                  process.exit(1);
                });
            });
          })
          .catch(r => {
            console.log(r);
            process.exit(1);
          });
      })
      .catch(error => {
        console.log(error);
        process.exit(1);
      });
  });
}

function addArticles(cursor) {
  console.log('Starting to migrate articles');
  cursor.forEach(e => {
    if (!e.createdAt) {
      e.createdAt = new Date();
    }

    if (!e.updatedAt) {
      e.updatedAt = new Date();
    }

    const userQuery = 'SELECT "Id" FROM "Users" WHERE "Username" = $1';
    const userValues = [e.username];
    pg.query(userQuery, userValues)
      .then(res => {
        let userId;
        if (res.rows.length == 0) {
          userId = 1;
        } else {
          userId = res.rows[0].Id;
        }
        const text =
          'INSERT INTO "Articles"("UUID", "UserId", "Title", "Body", "Tags", "CreatedAt", "UpdatedAt") VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        const values = [e._id.toString(), userId, e.title, e.body, e.tags, e.createdAt, e.updatedAt];
        pg.query(text, values).catch(error => {
          console.log(error);
          process.exit(1);
        });
      })
      .catch(err => {
        console.log(err);
        process.exit(1);
      });
  });
}

function addQuestions(cursor) {
  console.log('Starting to migrate questions');
  cursor.forEach(e => {
    if (!e.createdAt) {
      e.createdAt = new Date();
    }

    if (!e.updatedAt) {
      e.updatedAt = new Date();
    }

    const userQuery = 'SELECT "Id" FROM "Users" WHERE "Username" = $1';
    const userValues = [e.username];
    pg.query(userQuery, userValues)
      .then(res => {
        let userId;
        if (res.rows.length == 0) {
          userId = 1;
        } else {
          userId = res.rows[0].Id;
        }
        const text =
          'INSERT INTO "Questions"("UUID", "UserId", "QuestionInformation", "QuestionBody", "Tags", "CreatedAt", "UpdatedAt") VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        const values = [e._id.toString(), userId, e.info, e.question, e.tags, e.createdAt, e.updatedAt];
        pg.query(text, values).catch(error => {
          console.log(error);
          process.exit(1);
        });
      })
      .catch(err => {
        console.log(err);
        process.exit(1);
      });
  });
}

function addAnswers(cursor) {
  console.log('Starting to migrate answers');
  cursor.forEach(e => {
    if (!e.createdAt) {
      e.createdAt = new Date();
    }

    if (!e.updatedAt) {
      e.updatedAt = new Date();
    }

    const userQuery = 'SELECT "Id" FROM "Users" WHERE "Username" = $1';
    const userValues = [e.username];
    pg.query(userQuery, userValues)
      .then(res => {
        let userId;
        if (res.rows.length == 0) {
          userId = 1;
        } else {
          userId = res.rows[0].Id;
        }
        const q = 'SELECT "Id" FROM "Questions" WHERE "UUID" = $1';
        const v = [e.questionId];
        pg.query(q, v)
          .then(re => {
            const questionId = re.rows[0].Id;
            const text =
              'INSERT INTO "Answers"("UUID", "UserId", "QuestionId", "AnswerBody", "CreatedAt", "UpdatedAt") VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
            const values = [e._id.toString(), userId, questionId, e.answer, e.createdAt, e.updatedAt];
            pg.query(text, values).catch(error => {
              console.log(error);
              process.exit(1);
            });
          })
          .catch(error => {
            console.log(error);
            process.exit(1);
          });
      })
      .catch(err => {
        console.log(err);
        process.exit(1);
      });
  });
}

function addComments(cursor) {
  console.log('Starting to migrate comments');
  cursor.forEach(e => {
    if (!e.createdAt) {
      e.createdAt = new Date();
    }

    if (!e.updatedAt) {
      e.updatedAt = new Date();
    }

    const userQuery = 'SELECT "Id" FROM "Users" WHERE "Username" = $1';
    const userValues = [e.username];
    pg.query(userQuery, userValues)
      .then(res => {
        let userId;
        let postId;
        let text;
        let values;
        if (res.rows.length == 0) {
          userId = 1;
        } else {
          userId = res.rows[0].Id;
        }

        let q = 'SELECT "Id" FROM "Answers" WHERE "UUID" = $1';
        const v = [e.postId];
        pg.query(q, v)
          .then(re => {
            if (re.rows.length === 0) {
              q = 'SELECT "Id" FROM "Articles" WHERE "UUID" = $1';
              pg.query(q, v)
                .then(res => {
                  postId = res.rows[0].Id;
                  text =
                    'INSERT INTO "Comments"("UUID", "UserId", "ArticleId", "Body", "CreatedAt", "UpdatedAt") VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
                  values = [e._id.toString(), userId, postId, e.comment, e.createdAt, e.updatedAt];
                  pg.query(text, values).catch(error => {
                    console.log(error);
                    process.exit(1);
                  });
                })
                .catch(error => {
                  console.log(error);
                  process.exit(1);
                });
            } else {
              postId = re.rows[0].Id;
              text =
                'INSERT INTO "Comments"("UUID", "UserId", "AnswerId", "Body", "CreatedAt", "UpdatedAt") VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
              values = [e._id.toString(), userId, postId, e.comment, e.createdAt, e.updatedAt];
              pg.query(text, values).catch(error => {
                console.log(error);
                process.exit(1);
              });
            }
          })
          .catch(error => {
            console.log(error);
            process.exit(1);
          });
      })
      .catch(err => {
        console.log(err);
        process.exit(1);
      });
  });
}

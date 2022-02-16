const express = require("express");
const router = express.Router();

module.exports = (db) => {

  //===============LISTS====================


  //Get all lists for a user private and public


  router.get("/", (req, res) => {
    const userId = req.query.userId; 

    const accountId = req.query.accountId;

    db.query(`SELECT DISTINCT lists.id as id, lists.name as name      
              FROM lists
              JOIN user_lists ON lists.id = user_lists.list_id 
              WHERE user_lists.account_id = $1 AND lists.is_private = false OR user_lists.user_id = $2 AND lists.is_private = true ;`, [ accountId, userId ])
      .then(data => {
        const lists = data.rows;
        res.json({ lists });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });



  //Create a new list


  router.post("/", (req, res) => {
    console.log(req.body);
    const listName = req.body.newList;
    const userId = req.query.userId; 
    const accountId = req.query.accountId;
    db.query(`INSERT INTO lists (name) VALUES ($1) RETURNING *;`, [ listName ] )
      .then(data => {
        const listId = data.rows[0].id;
        console.log(listId)
        db.query(`INSERT INTO user_lists (user_id, list_id, account_id) VALUES ($1, $2, $3) RETURNING *;`, [ userId, listId, accountId])          
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    });

    //Delete a list


    router.delete("/:id", (req, res) => {
      const list_id = req.params.id
      db.query(`DELETE FROM lists WHERE id = $1`, [list_id])
        .then(data => {
          console.log("SERVER line 65",data.rows[0]);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    })


    //Update a list


    router.put("/:id", (req, res) => {
      console.log(req.body);
      const listId = req.params.id;
      const { name } = req.body;
      const is_private = false;
      db.query(`UPDATE lists SET name = $1, is_private = $2 WHERE id = $3 ;`, [ name, is_private, listId ] )
      .then(data => {
        const newListName = data.rows[0].name;
        res.json( {newListName} );
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    })



    //================LIST ITEMS==================



  //Get specific list and its items for a user


  router.get("/items", (req, res) => {
    const userId = req.query.userId;  
    const listId = req.query.listId;
    db.query(`SELECT list_items.id as id, lists.name as name, item_name as item
              FROM list_items
              JOIN lists ON list_id = lists.id
              WHERE user_id = $1 AND list_id = $2;`, [ userId, listId ])
      .then(data => {
        const lists = data.rows;
        res.json({ lists });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  //Create a new list item

  router.post("/items", (req, res) => {
    console.log("SERVER REC.BODY", req.body);
    //const { item_name, list_id, user_id } = req.body
    const itemName = req.body.item_name;
    const listId = req.body.list_id;
    const userId = req.body.user_id; 
    //const accountId = req.query.accountId;
    db.query(`INSERT INTO list_items (item_name , list_id, user_id) VALUES ($1, $2, $3) RETURNING *;`, [ itemName, listId, userId ] )
    .then(data => {
      console.log('data = ', data.rows[0]);
      const newItem = {
        item_name : data.rows[0].item_name,
        list_id : data.rows[0].list_id,
        user_id : data.rows[0].user_id        
      }
      res.json( {newItem} );
    })
      .catch(err => {
        console.log(err)
        res
          .status(500)
          .json({ error: err.message });
      });
    });

    //Update an item inside a list


    router.put("/items/:id", (req, res) => {
      console.log(req.body);
      const itemId = req.params.id;
      const { name, listId } = req.body;
      const userId = 1; //How to get userId ? 
      db.query(`UPDATE list_items SET item_name = $1 WHERE list_id = $2 AND user_id = $3 AND id = $4;`, [ name, listId, userId, itemId ] )
      .then(data => {
        const newItemName = data.rows[0].item_name;
        res.json( {newItemName} );
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    })
    
    //Delete an item from the list


    router.delete("/items/:id", (req, res) => {
      const item_id = req.params.id
      db.query(`DELETE FROM list_items WHERE id = $1`, [item_id])
        .then(data => {
          console.log(data.rows[0]);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    })
  return router;
};


//Taken out from lists post request

        // .then(data => {
          //   console.log(data.rows[0]);
          //     db.query(`INSERT INTO list_items (item_name, list_id, user_id) VALUES ($1, $2, $3) RETURNING *;`, [ item, listId, userId ])
          //       .then(data => {
          //         console.log(data.rows[0]);
          //         const listId = data.rows[0].list_id;
          //         const newList = {
          //           list : listId, //how to get list name instead ?
          //           item : data.rows[0].item 
          //         }
          //         res.json( {newList} );
          //       })
          //       .catch(err => {
          //         res
          //           .status(500)
          //           .json({ error: err.message });
          //       });
          // })
          // .catch(err => {
          //   res
          //     .status(500)
          //     .json({ error: err.message });
          // });
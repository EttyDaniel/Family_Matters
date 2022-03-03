const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  //Get all contacts for a specific account
  router.get("/", (req, res) => {
    const userId = req.query.userId;
    db.query(`SELECT * FROM contacts WHERE user_id = $1;`, [userId])
      .then(data => {
        const contacts = data.rows;
        res.json({ contacts });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //Create a new contact for a user
  router.post("/", (req, res) => {
    console.log(req.body);
    const { name, phone_number, email, address } = req.body;
    console.log('name = ', name)
    const userId = req.query.userId;
    const accountId = req.query.accountId;
    const values = [ name, phone_number, email, address, accountId, userId];
    console.log('values = ', values);
    db.query(`INSERT INTO contacts (name, phone_number, email, address, account_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, values )
      .then(data => {
        console.log('data = ', data.rows[0]);
        const newContact = {
          name : data.rows[0].name,
          phone_number : data.rows[0].phone_number,
          email : data.rows[0].email,
          address : data.rows[0].address
        }
        res.json( {newContact} );
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //Update an existing contact for a user
  router.put("/", (req, res) => {
    const contact_id = req.query.contactId;
    const userId = req.query.userId;
    console.log('id = ', req.params.id);
    console.log('body =======+ ', req.body);
    const { name, phone_number, email, address } = req.body;
    const values = [name, phone_number, email, address, userId, contact_id];
    db.query(`UPDATE contacts SET name = $1, phone_number = $2, email = $3, address = $4 WHERE user_id = $5 AND id = $6 RETURNING *;`, values)
      .then(data => {
        console.log(data.rows[0]);
        const updatedContact = {
          id: data.rows[0].id,
          name : data.rows[0].name,
          phone_number : data.rows[0].phone_number,
          email : data.rows[0].email,
          address : data.rows[0].address
        }
        res.json({ updatedContact} )
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //Delete a contact for a user
  router.delete("/:id", (req, res) =>{
    const contactId = req.params.id;
    db.query(`DELETE FROM contacts WHERE id = $1`, [contactId])
      .then(data => {
        console.log(data.rows[0]);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
import React, { useState} from "react";
import axios from "axios";

function ListEdit({ list }) {
  const [newName, setNewName] = useState(list.name);

  const updateName = (e) => {
    e.preventDefault();
    const body = { newName };
    axios.put(`/api/lists/${list.id}`, body).then((res) => {
      window.location = "/lists";
    });
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-warning"
        data-toggle="modal"
        data-target={`#id${list.id}`}
      >
        Edit
      </button>

      <div
        className="modal fade"
        id={`id${list.id}`}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit list name
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={updateName}
              >
                Save Changes
              </button>
              <button type="button" className="btn btn-primary">
                close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListEdit;

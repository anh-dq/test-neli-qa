import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { TODOS } from "../App";

export const ADD_TODO = gql`
  mutation AddTodo($description: String!) {
    addTodo(description: $description)
  }
`;

export const EDIT_TODO = gql`
  mutation EditTodo(
    $editTodoId: Int!
    $description: String!
    $isFinished: Int!
  ) {
    editTodo(
      id: $editTodoId
      description: $description
      isFinished: $isFinished
    )
  }
`;

const TodoForm = ({
  edit = false,
  value = "",
  exitEditing,
  id,
  isFinished,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const [addTodo] = useMutation(ADD_TODO, {
    variables: { description: inputValue },
    refetchQueries: [TODOS],
  });

  const [editTodo] = useMutation(EDIT_TODO, {
    refetchQueries: [TODOS],
  });

  const onChange = (event) => setInputValue(event.target.value);

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      exitEditing();
    }
  };

  const onBlur = (event) => {
    if (event.target.value.trim() === "") {
      setInputValue(value);
    } else {
      //   setValue(event.target.value)
    }
  };

  const submitFormHandler = (e) => {
    e.preventDefault();

    if (inputValue.trim() === "") {
      setInputValue(value);
      return;
    }

    if (edit) {
      editTodo({
        variables: {
          editTodoId: id,
          description: inputValue,
          isFinished: Number(isFinished),
        },
      });
      exitEditing();
    } else {
      addTodo();
      setInputValue("");
    }
  };

  return (
    <form action="#" className="form" onSubmit={submitFormHandler}>
      <div className="form-group">
        <input
          type="text"
          className={`form-input ${edit ? "form-input--edit" : ""}`}
          value={inputValue}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />
        {/* <input type="text" className="form-input" /> */}
        <button
          type="submit"
          className={` form-btn ${
            edit ? "form-btn--edit" : "form-btn--create"
          }`}
        >
          {`${edit ? "Edit" : "Add"}`} todo
        </button>
      </div>
    </form>
  );
};

export default TodoForm;

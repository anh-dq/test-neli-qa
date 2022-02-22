import React, { useState } from "react";
import TodoForm from "./TodoForm";
import { gql, useMutation } from "@apollo/client";
import { TODOS } from "../App";
import { EDIT_TODO } from "./TodoForm";

export const DELETE_TODO = gql`
  mutation Mutation($deleteTodoId: Int!) {
    deleteTodo(id: $deleteTodoId)
  }
`;

const Todo = ({ id, description, isFinished }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [deleteTodo] = useMutation(DELETE_TODO, {
    variables: { deleteTodoId: id },
    refetchQueries: [TODOS],
  });

  const [toggleTodoIsFinished] = useMutation(EDIT_TODO, {
    refetchQueries: [TODOS],
  });

  const toggleEditing = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };

  const toggleIsFinished = () => {
    toggleTodoIsFinished({
      variables: {
        editTodoId: id,
        description: description,
        isFinished: Number(!isFinished),
      },
    });
  };

  if (isEditing) {
    return (
      <TodoForm
        edit={true}
        value={description}
        exitEditing={toggleEditing}
        id={id}
        isFinished={isFinished}
      />
    );
  }

  return (
    <div
      className={`todo ${isFinished && "todo-finished"}`}
      onClick={toggleIsFinished}
    >
      <h2 className="todo-description">{description}</h2>
      <button className="todo-btn" onClick={toggleEditing}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="todo-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </button>

      <button className="todo-btn" onClick={deleteTodo}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="todo-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default Todo;

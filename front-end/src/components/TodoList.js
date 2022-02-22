import React from "react";
import Todo from "./Todo";
import QueryResult from "./QueryResult";

const TodoList = ({ error, loading, todos }) => {
  return (
    <div className="todos">
      <QueryResult error={error} loading={loading} data={todos}>
        {todos?.map((todo) => (
          <Todo
            key={todo.id}
            id={todo.id}
            isFinished={todo.isFinished}
            description={todo.description}
          />
        ))}
      </QueryResult>
    </div>
  );
};

export default TodoList;

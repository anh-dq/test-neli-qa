import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import { gql, useQuery } from "@apollo/client";
import "./index.css";

export const TODOS = gql`
  query TODOS {
    todos {
      id
      description
      isFinished
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(TODOS);

  return (
    <main className="app">
      <h1 className="app-heading">What do you want to do today?</h1>
      <div className="container">
        <TodoForm />
      </div>
      <div className="container">
        <TodoList todos={data?.todos} error={error} loading={loading} />
      </div>
    </main>
  );
}

export default App;

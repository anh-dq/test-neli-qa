const QueryResult = ({ loading, error, data, children }) => {
  if (error) {
    return <p className="center">ERROR: {error.message}</p>;
  }
  if (loading) {
    return <p className="center">Loading...</p>;
  }
  if (!data) {
    return <p className="center">Nothing to show...</p>;
  }
  if (data) {
    return children;
  }
};

export default QueryResult;

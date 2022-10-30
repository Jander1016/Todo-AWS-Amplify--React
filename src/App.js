import { Amplify, API, graphqlOperation } from "aws-amplify";
import { useEffect, useState } from "react";
import { createTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Text,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

function App({ signOut, user }) {
  const [data, setData] = useState({ name: "", description: "" });
  const [todos, setTodos] = useState([]);
  const [tasks, setTasks] = useState([]);

  const handleInputChange = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!data.name || !data.description) return;

      const todo = { ...data };
      setTodos([...todos, todo]);
      setData({ name: "", description: "" });
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
      console.log(tasks);
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadtasks = async () => {
    const result = await API.graphql(graphqlOperation(listTodos));
    const listData = await result.data.listTodos.items;
    setTasks(listData);
  };

  useEffect(() => {
    loadtasks();
  }, []);

  return (
    <div className="container ">
      <div className="row">
        <div className="col-md4 offset-md-4">
				<Heading level={1}>Hello {user.username}</Heading>
        <Button onClick={signOut}>Sign out</Button>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name Task</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name task"
                id="name"
                autoComplete="off"
                value={data.name}
                onChange={(e) => handleInputChange(e)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description Task</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                id="description"
                value={data.description}
                onChange={(e) => handleInputChange(e)}
              />
            </Form.Group>
            <Button type="submit">Create task</Button>
            {tasks
              ? tasks.map((task) => (
                  <article key={task.id}>
                    <Heading level={5}>{task.name}</Heading>
                    <Text as="span">{task.description}</Text>
                  </article>
                ))
              : null}
          </Form>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(App);

import { useState } from 'react';
import { useCreateToDo } from '../hooks';

export default function CreateTodoInput() {
  const [todo, setTodo] = useState('test');

  const [createTodo, { loading }] = useCreateToDo();

  const handlerInput = (e) => {
    console.log(e);
    setTodo(e.target.value);
  };
  const handlerCreateButton = (e) => {
    createTodo({
      variables: {
        data: {
          text: todo ? todo : 'test',
          completed: false,
        },
      },
      // awaitRefetchQueries: true,
      // refetchQueries: ['toDoList'],
      onError: alert,
    });
    setTodo('test');
  };
  return (
    <div>
      <input disabled={loading} onChange={handlerInput} value={todo} type='text' />
      <button disabled={loading} onClick={handlerCreateButton}>
        Add To Do
      </button>
    </div>
  );
}

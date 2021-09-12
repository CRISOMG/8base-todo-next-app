import { useListToDo } from '../hooks';
import ToDo from '../components/ToDo';
import CreateTodoInput from '../components/CreateToDoInput';

export function ToDoList() {
  const { loading, data, error } = useListToDo();

  return (
    <section className='container'>
      <div>
        <h1>To Do</h1>
      </div>
      {!loading && data && (
        <ul className='todo-list'>
          {data.todosList.items.map(({ id, text, completed }) => (
            <li key={id}>
              <ToDo id={id} text={text} completed={completed} />
              <hr />
            </li>
          ))}
        </ul>
      )}
      {loading && <p>loading...</p>}
      <div className='todo'>
        <CreateTodoInput />
      </div>
    </section>
  );
}

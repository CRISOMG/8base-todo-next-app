import { useListToDo } from '../hooks';
import ToDo from '../components/ToDo';
import CreateTodoInput from '../components/CreateToDoInput';


/**
 * Contenedor de una lista de `<ToDo />`
 * 
 * @see {@link ToDo}
 * @see {@link useListToDo}
 */
export default function ToDoList() {
  const { loading, data, } = useListToDo();

  return <section className='container'>
    <div>
      <h1>To Do</h1>
    </div>
    {!loading && data && (
      <ul className='todo-list'>
        {data.todosList.items.map(({ id, text, completed }) =>
          <ToDo key={id} {...{ id, text, completed }} />
        )}
      </ul>
    )}
    {loading && <p>loading...</p>}
    <div className='todo'>
      <CreateTodoInput />
    </div>
    <p style={{ color: 'gray', fontSize: '12px' }}>Click task to edit it.</p>
  </section>;
}

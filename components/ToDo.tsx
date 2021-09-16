import { useState, } from 'react';
import { useToggle, useUpdateToDo, useDeleteToDo, useCheckToDo } from '../hooks';

interface ToDoProps {
  id: string,
  text: string,
  completed: boolean
}

/**
 * Componente que controla las acciones `updateTodo` `deleteTodo` `checkTodo`
 * 
 * @see {@link useUpdateToDo}
 * @see {@link useDeleteToDo}
 * @see {@link useCheckToDo}
 *
 * @param {string} id - requerido para actualizar y borrar tarea.
 * @param {string} text - texto que describe la tarea a realizar.
 * @param {boolean} completed - booleano que indica si la tarea esta completa.
 */
function ToDo({ id, text, completed }: ToDoProps) {
  const isTestText = text === 'test' ? `${text} updated` : text;
  const [toDoText, setToDoText] = useState(isTestText);
  const { selected, toggle } = useToggle();

  const [updateTodo, updateToDoState] = useUpdateToDo(id, toDoText);
  const [deleteTodo, deleteToDoState] = useDeleteToDo(id);
  const [checkTodo, checkTodoState] = useCheckToDo(id, completed);

  const disableButtons = updateToDoState.loading || deleteToDoState.loading;

  const handlerInput = (e) => {
    setToDoText(e.target.value);
  };
  const handlerDeleteButton = (e) => {
    deleteTodo();
  };
  const handlerUpdateButton = (e) => {
    updateTodo({
      onCompleted: () => toggle(),
    });
  };
  const handlerToDoCheck = (e) => {
    checkTodo();
  };
  return (
    <li>
      {!selected && !disableButtons ? (
        <div className='todo'>
          <span className='todo-span' onClick={toggle}>
            {text}
          </span>
          <input disabled={checkTodoState.loading} type='checkbox' onChange={handlerToDoCheck} checked={completed} />
        </div>
      ) : (
        <div className='todo'>
          <input disabled={disableButtons} onChange={handlerInput} type='text' value={toDoText} max={256} />
          <div className='todo-buttons'>
            <button disabled={disableButtons} onClick={toggle} className='todo-button close'>
              ↰
            </button>
            <button disabled={disableButtons} onClick={handlerUpdateButton} className='todo-button update'>
              update
            </button>
            <button disabled={disableButtons} onClick={handlerDeleteButton} className='todo-button delete'>
              delete
            </button>
          </div>
        </div>
      )}
      <hr />
    </li>
  );
}

export default ToDo

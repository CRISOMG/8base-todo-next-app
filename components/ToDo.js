import { useState } from 'react';
import { useToggle, useUpdateToDo, useDeleteToDo, useCheckToDo } from '../hooks';

export default function ToDo({ id, text, completed }) {
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
      onCompleted: toggle(),
    });
  };
  const handlerToDoCheck = (e) => {
    checkTodo();
  };
  return !selected && !disableButtons ? (
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
  );
}

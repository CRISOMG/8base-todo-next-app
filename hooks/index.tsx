import { useState } from 'react';
import { gql, useQuery, QueryResult, useMutation, MutationTuple } from '@apollo/client';

const errorHandler = (error) => {
  console.error(error)
  if (typeof window !== 'undefined') {
    alert(error);
    error.graphQLErrors.forEach((e) => {
      if (e.code === 'NotAuthorizedError' || e.code === 'TokenExpiredError') {
        localStorage.removeItem('token');
        location.href = '/login';
      }
    });
  }
};

const LIST_TODO = gql`
  query toDoList {
    todosList {
      items {
        id
        text
        completed
      }
    }
  }
`;

type toDo = {
  id: string,
  text: string,
  completed: boolean,
  __typename: string
}

type todoListData = QueryResult<{
  todosList: {
    items: toDo[]
    __typename: string,
  }
}>

/**
 * Custom Hook para Traer una Lista de tareas
 * 
 * @see https://www.apollographql.com/docs/react/data/queries/
 */
export function useListToDo(): todoListData {
  return useQuery(LIST_TODO, {
    onError: errorHandler,
  })
};

type CreateToDoData = {
  todoCreate: toDo
}

type CreateToDoVariables = {
  data: {
    text: string,
    completed: boolean
  }
}

/**
 * Custom Hook para Crear una tarea
 * 
 * @param {string} [text]
 * @param {boolean} [completed]
 *
 * @see https://www.apollographql.com/docs/react/data/mutations/
 */
export function useCreateToDo(text?: string, completed?: boolean): MutationTuple<CreateToDoData, CreateToDoVariables> {
  return useMutation(
    gql`
      mutation CreateToDo($data: TodoCreateInput!) {
        todoCreate(data: $data) {
          id
          text
          completed
          __typename
        }
      }
    `,
    {
      variables: {
        data: {
          text,
          completed,
        },
      },
      onError: errorHandler,
      update(cache, result) {
        const { todosList } = cache.readQuery({
          query: LIST_TODO,
        });
        cache.writeQuery({
          query: LIST_TODO,
          data: {
            todosList: {
              items: [...todosList.items, result.data.todoCreate],
              __typename: todosList.__typename,
            },
          },
        });
      },
    },
  );
}

type DeleteToDoData = {
  todoDelete: {
    success: boolean
  }
}

type DeleteToDoVariables = {
  data: {
    id: string
  }
}

/**
 * Custom Hook para Borrar una tarea
 *
 * @param {string} [id]
 *
 * @see https://www.apollographql.com/docs/react/data/mutations/
 */
export function useDeleteToDo(id): MutationTuple<DeleteToDoData, DeleteToDoVariables> {
  return useMutation(
    gql`
      mutation DeleteToDo($data: TodoDeleteInput!) {
        todoDelete(data: $data) {
          success
        }
      }
    `,
    {
      variables: {
        data: {
          id,
        },
      },
      onError: errorHandler,
      update(cache) {
        const todo: {} = cache.readFragment({
          id: `Todo:${id}`,
          fragment: gql`
            fragment getTodo on Todo {
              id
              text
              completed
              __typename
            }
          `,
        });
        cache.modify({
          fields: {
            todosList({ items, __typename }) {
              return {
                __typename,
                items: items.filter(({ __ref }) => __ref !== cache.identify(todo)),
              };
            },
          },
        });
      },
    },
  );
}


type UpdateToDoData = {
  todoUpdate: toDo
}

type UpdateToDoVariables = {
  data: {
    id: string,
    text: string
  }
}

/**
 * Custom Hook para Actualizar una tarea
 *
 * @param {string} [id]
 * @param {string} [text]
 *
 * @see https://www.apollographql.com/docs/react/data/mutations/
 */
export function useUpdateToDo(id, text): MutationTuple<UpdateToDoData, UpdateToDoVariables> {
  return useMutation(
    gql`
      mutation UpdateToDo($data: TodoUpdateInput!) {
        todoUpdate(data: $data) {
          id
          text
          completed
        }
      }
    `,
    {
      onError: errorHandler,
      variables: {
        data: {
          id,
          text,
        },
      },
    },
  );
}


type CheckToDoData = {
  todoToggle: toDo,
}

type CheckToDoVariables = {
  id: string
  completed: boolean
}

/**
 * Custom Hook para Checkear una tarea.
 *
 * @param {string} [id]
 * @param {boolean} [completed]
 *
 * @see https://www.apollographql.com/docs/react/data/mutations/
 */
export function useCheckToDo(id, completed): MutationTuple<CheckToDoData, CheckToDoVariables> {
  return useMutation(
    gql`
      mutation todoToggle($id: ID!, $completed: Boolean!) {
        todoToggle(id: $id, completed: $completed) {
          id
          text
          completed
        }
      }
    `,
    {
      variables: {
        id,
        completed,
      },
      onError: errorHandler,
    },
  );
}

type LoginUserData = {
  userLogin: {
    success: boolean,
    auth: {
      idToken: string,
      refresh: string
    }
  }
}

type LoginUserVariables = {
  data: {
    email: string,
    password: string
  }
}

/**
 * Custom Hook para autenticar un usuarion con email y contraseña.
 *
 * @param {string} [email]
 * @param {string} [password]
 * @see https://www.apollographql.com/docs/react/data/mutations/
 */
export function useLoginUser(email, password): MutationTuple<LoginUserData, LoginUserVariables> {
  return useMutation(
    gql`
      mutation userLogin($data: UserLoginInput!) {
        userLogin(data: $data) {
          success
          auth {
            idToken
            refreshToken
          }
        }
      }
    `,
    {
      variables: {
        data: {
          email,
          password,
        },
      },
      onError: errorHandler,
    },
  );
}


/**
 * Custom Hook tipo toggle state para mostrar y ocultar la contraseña del login.
 */
export function useToggle() {
  const [selected, setSelector] = useState(false);

  function toggle() {
    setSelector(!selected);
  }

  return {
    selected,
    toggle,
  };
}

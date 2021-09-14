import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const errorHandler = (error) => {
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
export function useListToDo() {
  return useQuery(LIST_TODO, {
    onError: errorHandler,
  });
}

export function useCreateToDo(text = 'test', completed = false) {
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
      onError: errorHandler,
      variables: {
        data: {
          text,
          completed,
        },
      },
      update(cache, result) {
        // const todo = cache.readFragment({
        //   id: cache.identify(result.data.todoCreate),
        //   query: gql`
        //     fragment newTodo on Todo {
        //       id
        //       text
        //       completed
        //       __typename
        //     }
        //   `,
        // });
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

export function useDeleteToDo(id = '') {
  return useMutation(
    gql`
      mutation DeleteToDo($data: TodoDeleteInput!) {
        todoDelete(data: $data) {
          success
        }
      }
    `,
    {
      onError: errorHandler,
      variables: {
        data: {
          id,
        },
      },
      update(cache) {
        const todo = cache.readFragment({
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

export function useUpdateToDo(id = '', text = '') {
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

export function useCheckToDo(id, completed) {
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
      onError: errorHandler,
      variables: {
        id,
        completed,
      },
    },
  );
}

export function useUserLogin(email, password) {
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
      onError: errorHandler,
      variables: {
        data: {
          email,
          password,
        },
      },
    },
  );
}

export function useToggle() {
  const [selected, setSelector] = useState(false);

  function toggle(e) {
    setSelector(!selected);
  }

  return {
    selected,
    toggle,
  };
}

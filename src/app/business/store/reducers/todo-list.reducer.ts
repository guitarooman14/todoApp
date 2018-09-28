import {ITodoListState} from '@Models/i-todolist-model';
import {TodoListModule} from '@Actions/todo-list.action';

const initialState: ITodoListState = {
  data: null,
  loading: false,
  loaded: false
};

export function todosReducer(
  state: ITodoListState = initialState,
  action: TodoListModule.Actions
): ITodoListState {

  switch (action.type) {
    case TodoListModule.ActionTypes.LOAD_INIT_TASKS:
      // Passe le loading a true
      return {
        ...state,
        loading: true
      };

    case TodoListModule.ActionTypes.SUCCESS_INIT_TASKS:
      // Bind state.data avec les todos du server
      // Passe le loaded a true et le loading a false
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };

    case TodoListModule.ActionTypes.ERROR_INIT_TASKS:
      // Error rend le loading a false
      return {
        ...state,
        loading: false
      };
    case TodoListModule.ActionTypes.ADD_TASK :
      return {
        ...state,
        data: [
          ...state.data,
          action.payload
        ]
      };
    case TodoListModule.ActionTypes.REMOVE_TASK :
      return {
        ...state,
        data : state.data.filter(task => task.id !== action.payload)
      };
    default:
      return state;
  }
}

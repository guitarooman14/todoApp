import {ITodoListModel, TodoListStateEntity} from '@Models/i-todolist-model';
import {TodoListModule} from '@Actions/todo-list.action';
import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';

export const TodoListAdapter: EntityAdapter<ITodoListModel> = createEntityAdapter<ITodoListModel>({
  sortComparer: false
});

const initialState: TodoListStateEntity = TodoListAdapter.getInitialState({
  loading: false,
  loaded: false,
  logs: undefined
});

export const {
  // select the array of task ids
  selectIds: selectTasksIds,
  // select the dictionary of task entities
  selectEntities: selectTasksEntities,
  // select the array of task
  selectAll: selectTasks,
  // select the total task count
  selectTotal: selectTotalTasks
} = TodoListAdapter.getSelectors();

export function todosReducer(
  state = initialState,
  action: TodoListModule.Actions
): TodoListStateEntity {

  switch (action.type) {
    // Load all tasks

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
        ...TodoListAdapter.addMany(action.payload, state),
        loading: false,
        loaded: true
      };

    // Create a new task

    case TodoListModule.ActionTypes.LOAD_ADD_TASK :
      return {
        ...state,
        loading: true
      };
    case TodoListModule.ActionTypes.SUCCESS_ADD_TASK :
      return {
        ...TodoListAdapter.addOne(action.payload, state),
        loading: false,
        logs: { type: 'SUCCESS', messageLabel: 'NewTaskAddedNotification' }
      };

    // Update an existing task

    case TodoListModule.ActionTypes.LOAD_UPDATE_TASK:
      return {
        ...state,
        loading: true
      };
    case TodoListModule.ActionTypes.SUCCESS_UPDATE_TASK:
      const { id, ...changes } = action.payload;
      return {
        ...TodoListAdapter.updateOne({id: id, changes: changes}, state),
        loading: false,
        logs: { type: 'SUCCESS', messageLabel: 'TaskUpdatedNotification' }
      };
    case TodoListModule.ActionTypes.LOAD_REMOVE_TASK :
      return {
        ...state,
        loading: true
      };
    case TodoListModule.ActionTypes.SUCCESS_REMOVE_TASK :
      return {
        ...TodoListAdapter.removeOne(action.payload, state),
        loading: false,
        logs: { type: 'SUCCESS', messageLabel: 'TaskRemovedNotification' }
      };
    case TodoListModule.ActionTypes.LOAD_ERROR_ACTION :
      return {
        ...state,
        loading: false,
        logs: { type: 'ERROR', messageLabel: action.payload.message },
      };
    default:
      return state;
  }
}

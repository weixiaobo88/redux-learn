const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if(state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

let nextTodoId = 0;
const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text
  }
};

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
  }
};


const {combineReducers} = Redux;

const todoApp = combineReducers({
  todos,
  visibilityFilter
});


const {Component} = React;

const Link = ({active, children, onClick}) => {
  if(active) {
      return <span>{children}</span>
  }

  return (
    <a href="#" onClick={e=> {
      e.preventDefault();
      onClick();
    }}
    >
      {children}
    </a>
  );
};

const setVisibilityFilter = (fitler) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
};

const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
};

const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return {
    onClick: dispatch(setVisibilityFilter(ownProps.filter))
  }
};


const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink filter='SHOW_ALL'>
      All
    </FilterLink>
    {' '}
    <FilterLink filter='SHOW_ACTIVE'>
      Active
    </FilterLink>
    {' '}
    <FilterLink filter='SHOW_COMPLETED'>
      Completed
    </FilterLink>
  </p>
);

const Todo = ({onClick, completed, text}) => (
  <li
    onClick={onClick}
    style={{
              textDecoration:
                completed
                  ? 'line-through'
                  : 'none'
          }}
  >
    {text}
  </li>
);

const TodoList = ({todos, onTodoClick}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={()=> onTodoClick(todo.id)}
      />
    )}
  </ul>
);



let AddTodo = ({dispatch}) => {
  let input;

  return (
    <div>
      <input type="text" ref={node => {input = node;}}/>
      <button onClick={()=> {
          dispatch(addTodo(input.value));
          input.value = '';
        }}>
        Add Todo
      </button>
    </div>
  )
};


const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(todo => todo.completed);
    case 'SHOW_ACTIVE':
      return todos.filter(todo => !todo.completed);
  }
};



const {Provider} = ReactRedux;
const {connect} = ReactRedux;
const {createStore} = Redux;

const mapStateProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
};

const mapDispatchProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  }
};

const VisibleTodoList = connect(mapStateProps, mapDispatchProps())(TodoList);
AddTodo = connect()(AddTodo);
const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);

const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);




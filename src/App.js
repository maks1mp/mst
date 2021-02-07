import {useCallback} from 'react';
import {observer} from 'mobx-react-lite'
import useStore from './hooks/useStore'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

const TaskCard = observer(({provided, snapshot, task}) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      {task.id}
      <br/>
      {task.title}
      <br/>
      {task.description}
    </div>
  );
})

const Column = observer(({provided, snapshot, section}) => {
  return (
    <div
      {...provided.droppableProps}
      ref={provided.innerRef}
    >
      <h1>{section.title}</h1>
      <div>
        {section.tasks.map(task => {
          return (
            <Draggable draggableId={task.id} key={task.id} index={task.index}>
              {(provided, snapshot) => <TaskCard provided={provided} snapshot={snapshot} task={task}/>}
            </Draggable>
          )
        })}
      </div>
    </div>
  )
});

function App() {
  const {users, boards} = useStore();

  console.log(users.users);

  const onDragEnd = useCallback(event => {
    const {source, destination} = event;

    boards.moveTask(source, destination);
  }, [boards])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {boards?.active?.sections.map(section => {
        return (
          <Droppable droppableId={section.id} key={section.id}>
            {(provided, snapshot) => <Column provided={provided} snapshot={snapshot} section={section}/>}
          </Droppable>
        )
      })}
    </DragDropContext>
  );
}

export default observer(App);

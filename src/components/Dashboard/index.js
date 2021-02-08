import {useCallback} from 'react';
import {observer} from 'mobx-react-lite'
import useStore from '../../hooks/useStore'
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import Column from './Column';
import './index.css';

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: 8,
  minHeight: 500,
});

function Dashboard() {
  const {boards} = useStore();

  const onDragEnd = useCallback(event => {
    const {source, destination, draggableId: taskId} = event;

    boards.moveTask(taskId, source, destination);
  }, [boards])

  return (
    <div className="dashboard">
      <DragDropContext onDragEnd={onDragEnd}>
        {boards?.active?.sections.map(section => {
          return (
            <div className="dashboard-column">
              <h1>{section.title}</h1>
              <Droppable droppableId={section.id} key={section.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}>
                    <Column section={section}/>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </DragDropContext>
    </div>
  );
}

export default observer(Dashboard);

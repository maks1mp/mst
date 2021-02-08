import {observer} from 'mobx-react-lite';
import {Draggable} from 'react-beautiful-dnd';
import Task from './Task';

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => {
  return {
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
  };
};

const Column = ({section}) => {
  return (
    <div>
      {section.tasks.map((task, index) => {
        return (
          <Draggable draggableId={task.id} key={task.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style
                )}
              >
                <Task task={task}/>
              </div>
            )}
          </Draggable>
        )
      })}
    </div>
  )
};

export default observer(Column);
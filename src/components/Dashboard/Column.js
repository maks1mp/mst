import {observer} from 'mobx-react-lite';
import {Draggable} from 'react-beautiful-dnd';
import Task from './Task';
import Card from '@material-ui/core/Card';

const getItemStyle = (isDragging, draggableStyle) => {
  return {
    padding: 8,
    marginBottom: 8,
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
              <Card
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style
                )}
              >
                <Task task={task}/>
              </Card>
            )}
          </Draggable>
        )
      })}
    </div>
  )
};

export default observer(Column);
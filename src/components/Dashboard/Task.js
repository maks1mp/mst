import {observer} from 'mobx-react-lite';

const Task = (({task}) => {
  return (
    <div>
      {task.id}
      <br/>
      {task.title}
      <br/>
      {task.description}
    </div>
  );
})

export default observer(Task);
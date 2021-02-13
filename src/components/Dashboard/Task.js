import {observer} from 'mobx-react-lite';
import CardContent from '@material-ui/core/CardContent';
import {Typography} from '@material-ui/core';
import User from '../common/User';

function Task({task}) {
  return (
    <CardContent>
      <Typography color="textPrimary" gutterBottom style={{fontSize: 18}}>
        {task.title}
      </Typography>
      <Typography color="textSecondary" gutterBottom>
        {task.description}
      </Typography>
      <User user={task.assignee} />
    </CardContent>
  );
}

export default observer(Task);
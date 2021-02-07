import {applySnapshot, flow, getParent, types} from 'mobx-state-tree';
import apiCall from '../api';
import {User} from './users';

export const STATUSES = {
  BACKLOG: 'BACKLOG',
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  CLOSED: 'CLOSED',
}

const Task = types.model('Task', {
  id: types.identifier,
  title: types.string,
  board_id: types.string,
  status: types.string,
  description: types.maybe(types.string),
  assignee: types.safeReference(User),
  index: types.number,
}).actions(self => {
  return {
    move: flow(function* (payload) {
      self.status = payload.status;
      self.index = payload.index;

      yield apiCall.put(`tasks/${self.id}`, {
        ...self,
        assignee: self.assignee.id,
      });
    })
  }
});

const BoardSection = types.model('BoardSection', {
  id: types.identifier,
  title: types.string,
  tasks: types.array(Task)
})
  .views(self => {
    return {
      get list() {
        if (self.tasks) {
          return self.tasks.sort((task1, task2) => task1.index - task2.index);
        }

        return [];
      }
    }
  })
  .actions(self => {
  return {
    load: flow(function* () {
      const {is: board_id} = getParent(self, 2);
      const {id: status} = self;

      self.tasks = yield apiCall.get('tasks', { board_id, status });

    }),
    afterCreate() {
      self.load();
    }
  };
})

const Board = types.model('Board', {
  id: types.identifier,
  title: types.string,
  sections: types.array(BoardSection)
});

const BoardStore = types.model('BoardStore', {
  active: types.safeReference(Board),
  boards: types.array(Board),
}).actions(self => {
  return {
    load: flow(function* () {
      self.boards = yield apiCall.get('boards');
      self.active = 'DEVELOPMENT';
    }),
    afterCreate() {
      self.load();
    },
    selectBoard(id) {
      self.active = id;
    },
    moveTask(source, destination) {
      console.log(source, destination);

      const fromSection = self.active.sections.find(section => section.id === source.droppableId);
      const taskToMove = fromSection.tasks.find(task => task.index === source.index);
      const toSection = self.active.sections.find(section => section.id === destination.droppableId);
      const toSectionTasks = toSection.tasks.toJSON();

      // let newPosition = destination.index - 1;

      // while () {
      //   newPosition--;
      // }

      // taskToMove.move({
      //   status: destination.droppableId,
      //   index: newPosition
      // });
    }
  }
})

export default BoardStore;
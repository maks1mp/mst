import {flow, getParent, types, onSnapshot, cast} from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';
import apiCall from '../api';
import {User} from './users';

const Task = types.model('Task', {
  id: types.identifier,
  title: types.string,
  description: types.maybe(types.string),
  assignee: types.safeReference(User),
});

const BoardSection = types.model('BoardSection', {
  id: types.identifier,
  title: types.string,
  tasks: types.array(Task)
})
  .actions(self => {
    return {
      load: flow(function* () {
        const {id: boardID} = getParent(self, 2);
        const {id: status} = self;
        const {tasks} = yield apiCall.get(`boards/${boardID}/tasks/${status}`);

        self.tasks = cast(tasks);

        onSnapshot(self, self.save);
      }),
      afterCreate() {
        self.load();
      },
      save: flow(function* ({tasks}) {
        const {id: boardID} = getParent(self, 2);
        const {id: status} = self;

        yield apiCall.put(`boards/${boardID}/tasks/${status}`, {tasks});
      }),
      addTask(taskPayload) {
        self.tasks.push(taskPayload);
      }
    };
  });

const Board = types.model('Board', {
  id: types.identifier,
  title: types.string,
  sections: types.array(BoardSection)
}).actions(self => {
  return {
    addTask(sectionId, taskPayload) {
      const section = self.sections.find(section => section.id === sectionId);

      section.tasks.push({
        id: uuidv4(),
        ...taskPayload
      });
    },
    moveTask(taskId, source, destination) {
      const fromSection = self.sections.find(section => section.id === source.droppableId);
      const toSection = self.sections.find(section => section.id === destination.droppableId);

      const taskToMoveIndex = fromSection.tasks.findIndex(task => task.id === taskId);
      const [task] = fromSection.tasks.splice(taskToMoveIndex, 1);

      toSection.tasks.splice(destination.index, 0, task.toJSON());
    },
  }
})

const BoardStore = types.model('BoardStore', {
  active: types.safeReference(Board),
  boards: types.array(Board),
}).actions(self => {
  return {
    load: flow(function* () {
      self.boards = yield apiCall.get('boards');
    }),
    afterCreate() {
      self.load();
    },
    selectBoard(id) {
      self.active = id;
    },
  }
})

export default BoardStore;
import { types } from 'mobx-state-tree';
import UsersStore from './users';
import BoardStore from './board';

const RootStore = types.model('RootStore', {
  users: types.optional(UsersStore, {}),
  boards: types.optional(BoardStore, {}),
});

export default RootStore;
import {useContext} from 'react';
import {StoreContext} from '../index';

export default function useStore() {
  return useContext(StoreContext);
}
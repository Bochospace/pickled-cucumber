import { SetupFnArgs } from '../types';
import { EntityMap } from './types';
declare const setup: (entities: EntityMap, { compare, getCtx, Given, onTearDown, setCtx, Then }: SetupFnArgs) => void;
export default setup;

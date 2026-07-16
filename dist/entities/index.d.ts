import { SetupFnArgs } from '../types.js';
import { EntityMap } from './types.js';
declare const setup: (entities: EntityMap, { compare, getCtx, Given, onTearDown, setCtx, Then }: SetupFnArgs) => void;
export default setup;

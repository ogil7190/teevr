import { createActions } from 'reduxsauce'

/* When Application Starts */
const { Types, Creators } = createActions({
  startup: null,
  firstStart: null,
  setConfig: [ 'config' ]
})

export const StartupTypes = Types;
export default Creators;

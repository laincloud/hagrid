export function createReducer(initialState, handlers) {
    return function(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        } else {
            return state;
        }
    }
}

export function createAction(type, ...argNames) {
    return function(...args) {
        let action = { type };
        _.forEach(argNames, (arg, index) => {
            action[arg] = args[index];
        });
        return action;
    }
}
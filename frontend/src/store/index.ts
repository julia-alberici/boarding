import { createStore } from 'redux';

// Minimal placeholder reducer
function reducer(state = {}, action: any) {
    switch (action.type) {
        default:
            return state;
    }
}

const store = createStore(reducer);

export default store;

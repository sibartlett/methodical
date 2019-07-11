import { thunk } from 'easy-peasy';
import { applyPatch, compare } from "fast-json-patch";
import { entries, last } from "lodash-es";
import feathers from "../feathers";

const initialState = {
  item: {
    schemaId: undefined,
    current: undefined,
    history: [],
    future: [],
    hasLoaded: false,
    isLoading: false,
    error: undefined,
    params: {},
    lastSaved: undefined
  },
  items: {
    schemaId: undefined,
    items: [],
    isLoading: false,
    hasLoaded: false,
    error: undefined,
    params: {}
  }
};

const getPath = (url, { route } = {}) => {
  if (!route) {
    return url;
  }

  return entries(route).reduce(
    (path, [key, value]) => path.replace(`:${key}`, value),
    url
  );
};

export default ({ url }) => {
  const [, model] = url.split('/');

  const getService = params => {
    const path = getPath(url, params);
    return feathers.service(path);
  };

  return {
    ...initialState,

    reset(state, payload = false) {
      if (payload) {
        return initialState;
      }

      return {
        ...state,
        item: initialState.item
      };
    },

    find__start(state) {
      state.items.isLoading = true;
      state.items.error = null;
    },
    find__success(state, { items, params }) {
      state.items.hasLoaded = true;
      state.items.items = items;
      state.items.params = params;
    },
    find__complete(state) {
      state.items.isLoading = false;
    },
    find__error(state, error) {
      state.items.error = error;
    },

    get__start(state) {
      state.item.isLoading = true;
      state.item.error = null;
    },
    get__success(state, { item, params }) {
      state.item.hasLoaded = true;
      state.item.current = item;
      state.item.params = params;
    },
    get__complete(state) {
      state.item.isLoading = false;
    },
    get__error: (state, error) => {
      state.item.error = error;
    },

    on__created(state, payload) {
      // TODO: fix for pagination
      state.items.items.push(payload);
    },

    post(state, { params, item }) {
      state.item.current = item;
      state.item.params = params;
      state.item.hasLoaded = true;

      // TODO: fix for pagination
      state.items.items.push(item);
    },

    on__patched(state, payload) {
      const { current } = state.item;

      if (current && current._id === payload._id) {
        state.item.current = payload;
      }

      state.items.items = state.items.items.map(x =>
        x._id === payload._id ? payload : x
      );
    },

    patch(state, payload) {
      const { current } = state.item;

      state.item.lastSaved = new Date();
      state.item.history.push(payload);
      state.item.future = [];

      applyPatch(current, payload.up);

      state.items.items = state.items.items.map(
        x => x._id === current._id ? current : x
      )
    },

    undo(state) {
      const diff = state.item.history.pop();

      if (!diff) {
        return;
      }

      const { current } = state.item;

      state.item.lastSaved = new Date();
      state.item.future.push(diff);

      applyPatch(current, diff.down);

      state.items.items = state.items.items.map(
        x => x._id === current._id ? current : x
      );
    },

    redo(state) {
      const diff = state.item.future.pop();

      if (!diff) {
        return;
      }

      const { current } = state.item;

      state.item.lastSaved = new Date();
      state.item.history.push(diff);

      applyPatch(current, diff.up);

      state.items.items = state.items.items.map(
        x => x._id === current._id ? current : x
      );
    },

    resetAll: thunk(async (actions) => {
      actions.reset(true);
    }),

    resetItem: thunk(async (actions) => {
      actions.reset();
    }),

    find: thunk(async (actions, { params } = {}) => {
      actions.find__start();

      try {
        const items = await getService(params).find(params);
        actions.find__success({ items, params });
      } catch (err) {
        actions.find__error(err);
      } finally {
        actions.find__complete();
      }
    }),

    get: thunk(async (actions, { id, params } = {}) => {
      actions.get__start();

      try {
        const item = await getService(params).get(id, params);
        actions.get__success({ item, params });
      } catch (err) {
        actions.get__error(err);
      } finally {
        actions.get__complete();
      }
    }),

    create: thunk(async (actions, payload, { getState }) => {
      const { params } = getState()[model].items;
      const item = await getService(params).create(payload);
      actions.post({ params, item });
      return item;
    }),

    save: thunk(async (actions, payload, { getState }) => {
      const { current = {}, params } = getState()[model].item;
      const updatedDoc = { _id: current._id, ...payload };
      const up = compare(current, updatedDoc);

      if (Object.keys(up).length) {
        const down = compare(updatedDoc, current);
        const diff = { up, down };
        actions.patch(diff);
        return getService(params).patch(current._id, diff.up);
      }
    }),

    undoChange: thunk(async (actions, payload, { getState }) => {
      const { current, history, params } = getState()[model].item;
      if (history.length) {
        const diff = last(history);
        actions.undo();
        return getService(params).patch(current._id, diff.down);
      }
    }),

    redoChange: thunk(async (actions, payload, { getState }) => {
      const { current, future, params } = getState()[model].item;
      if (future.length) {
        const diff = last(future);
        actions.redo();
        return getService(params).patch(current._id, diff.up);
      }
    })

  };
};

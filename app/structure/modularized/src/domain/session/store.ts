import { ActionHandler } from 'vuex';

import { isArray } from '@/utils/is';

import { UserInfo, UserPermission, UserAndPermissions } from './typing';
import { MODULE_NAME } from './helper';
import context from './context';

type UserAuthority = Record<'accessible' | 'operable', Record<string, boolean> | null>;

type SessionState = {
  user: UserInfo | null;
  authority: UserAuthority;
};

type SessionMutations<S> = {
  updateCurrentUser: (state: S, payload: UserInfo) => void;
  updateAuthority: (state: S, payload: UserAuthority) => void;
};

type SessionActions<S> = {
  fetchCurrentUser: ActionHandler<S, any>;
};

const state: () => SessionState = () => ({
  user: null,
  authority: {
    accessible: null,
    operable: null,
  },
});

const mutations: SessionMutations<SessionState> = {
  updateCurrentUser: (state, payload) => (state.user = payload),
  updateAuthority: (state, payload) => {
    console.log('updateAuthority', payload);
    state.authority = payload;
  },
};

function getAccessibleAuthority(
  permissions: Record<string, UserPermission> | UserPermission,
): Record<string, boolean> {
  let accessible: Record<string, boolean> = {};

  if (isArray(permissions)) {
    (permissions as string[]).forEach(permission => (accessible[permission] = true));
  } else {
    Object.keys(permissions).forEach(key => {
      accessible = { [key]: true, ...getAccessibleAuthority(permissions[key]) };
    });
  }

  return accessible;
}

const actions: SessionActions<SessionState> = {
  fetchCurrentUser: async ({ commit }) => {
    context.execute('getCurrentUser', (data: UserAndPermissions) => {
      const { permissions, ...others } = data;

      commit('updateCurrentUser', others);
      commit('updateAuthority', {
        accessible: getAccessibleAuthority(permissions),
        operable: null,
      });
    });
  },
};

export default {
  namespace: MODULE_NAME,
  store: {
    namespaced: true,
    state,
    mutations,
    actions,
  },
};

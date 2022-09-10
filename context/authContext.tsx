import * as React from 'react';
import { apiAuth } from '../axios/api';

type Action = {
  type: 'login';
  payload: { id: number; email: string; name: string };
};

type Dispatch = (action: Action) => void;
type State = { id: number | null; email: string | null; name: string };
type AuthProviderProps = { children: React.ReactNode };

const AuthStateComponent = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

function authReducer(state: State, action: Action) {
  switch (action.type) {
    case 'login': {
      console.log('acctionn reducer', action);
      return {
        id: action.payload.id,
        email: action.payload.email,
        name: action.payload.name,
      };
    }
    default: {
      return state;
    }
  }
}

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = React.useReducer(authReducer, {
    id: null,
    email: '',
    name: '',
  });

  React.useEffect(() => {
    const getUser = async () => {
      if (state.id === null) {
        const { data } = await apiAuth('/user/myAccount');
        dispatch({ type: 'login', payload: data.user });
      }
    };
    getUser();
  }, [state]);

  const value = { state, dispatch };
  return (
    <AuthStateComponent.Provider value={value}>
      {children}
    </AuthStateComponent.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthStateComponent);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };

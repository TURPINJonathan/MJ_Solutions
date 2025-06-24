import { userReducer, initialState, UserState } from '#store/user/user.reducer';
import * as UserActions from '#store/user/user.actions';
import { User } from '#SModels/user.model';

describe('User Reducer', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'ROLE_USER',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it('should return the initial state', () => {
    const state = userReducer(undefined, { type: '@@init' } as any);
    expect(state).toEqual(initialState);
  });

  it('should set loading true on loadUser', () => {
    const state = userReducer(initialState, UserActions.loadUser());
    expect(state.loading).toBeTrue();
  });

  it('should set user and loading false on loadUserSuccess', () => {
    const state = userReducer(initialState, UserActions.loadUserSuccess({ user: mockUser }));
    expect(state.user).toEqual(mockUser);
    expect(state.loading).toBeFalse();
  });

  it('should set error and loading false on loadUserFailure', () => {
    const error = { message: 'fail' };
    const state = userReducer(initialState, UserActions.loadUserFailure({ error }));
    expect(state.error).toEqual(error);
    expect(state.loading).toBeFalse();
  });
});
import { selectUser, selectUserLoading, selectUserError } from '#store/user/user.selectors';
import { UserState } from '#store/user/user.reducer';
import { User } from '#SModels/user.model';

describe('User Selectors', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'ROLE_USER',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const state: { user: UserState } = {
    user: {
      user: mockUser,
      loading: true,
      error: null
    }
  };

  it('should select user', () => {
    expect(selectUser.projector(state.user)).toEqual(mockUser);
  });

  it('should select loading', () => {
    expect(selectUserLoading.projector(state.user)).toBeTrue();
  });

  it('should select error', () => {
    expect(selectUserError.projector(state.user)).toBeNull();
  });
});
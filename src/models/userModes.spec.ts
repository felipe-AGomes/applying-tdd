type UserProps = {
	id: string;
	name: string;
	email: string;
};

interface IUserRepository {
	createUser(user: UserProps): {
		error: boolean;
		message: string;
		user: UserProps;
	};
}

class UserRepositoryMongo implements IUserRepository {
	createUser(user: UserProps): {
		error: boolean;
		message: string;
		user: UserProps;
	} {
		

		return {
			error: false,
			message: 'Usuário cadastrado com sucesso',
			user,
		};
	}
}

describe('UserRepositoryMongo', () => {
	it('should return an user when is called with a correct parameters', () => {
		const userRepositoryMongo = new UserRepositoryMongo();

		const result = userRepositoryMongo.createUser({
			email: 'some_user_email',
			id: 'some_user_id',
			name: 'some_user_name',
		});

		expect(result).toEqual({
			error: false,
			message: 'Usuário cadastrado com sucesso',
			user: {
				email: 'some_user_email',
				id: 'some_user_id',
				name: 'some_user_name',
			},
		});
	});

	it('should return an error when a user already exists ', () => {
		const userRepositoryMongo = new UserRepositoryMongo();

		const result = userRepositoryMongo.createUser({
			email: 'some_user_email',
			id: 'some_user_id',
			name: 'user_already_exists',
		});
	});
});

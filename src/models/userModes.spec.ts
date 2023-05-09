import {
	DatabaseConnection,
	DatabaseConnectionLocalMongo,
} from '../services/connectDb';
import User from './collections/UserCollection';

type UserProps = {
	user: string;
	email: string;
};

interface IUserRepository {
	createUser(user: UserProps): Promise<{
		error: boolean;
		message: string;
		user?: any;
	}>;
}

class UserRepositoryMongo implements IUserRepository {
	constructor(private readonly DatabaseConnection: DatabaseConnection) {}
	async createUser(user: UserProps): Promise<{
		error: boolean;
		message: string;
		user?: any;
	}> {
		await this.DatabaseConnection.connectDb();
		const userData = await User.find({ email: user.email });

		if (userData.length > 0) {
			return {
				error: true,
				message: 'Usuário já existe',
			};
		}

		const newUser = await User.create(user);

		return {
			error: false,
			message: 'Usuário cadastrado com sucesso',
			user: newUser,
		};
	}
}

describe('UserRepositoryMongo.createUser', () => {
	const makeSut = () => {
		const databaseConnectionLocalMongo = new DatabaseConnectionLocalMongo();
		const sut = new UserRepositoryMongo(databaseConnectionLocalMongo);
		return { sut, databaseConnectionLocalMongo };
	};
	beforeAll(async () => {
		const { databaseConnectionLocalMongo } = makeSut();
		await databaseConnectionLocalMongo.connectDb();
		await User.create({
			email: 'some_email_already_exists',
			user: 'some_user_name',
		});
	});

	afterAll(async () => {
		const { databaseConnectionLocalMongo } = makeSut();
		await User.deleteMany({});
		await databaseConnectionLocalMongo.disconnectDb();
	});

	it('should return an user when is called with a correct parameters', async () => {
		const { sut } = makeSut();

		const result = await sut.createUser({
			email: 'some_user_email',
			user: 'some_user_name',
		});

		expect(result).toHaveProperty('error', false);
		expect(result).toHaveProperty('message', 'Usuário cadastrado com sucesso');
		expect(result.user).toHaveProperty('email', 'some_user_email');
		expect(result.user).toHaveProperty('user', 'some_user_name');
	});

	it('should return an error when a user already exists ', async () => {
		const { sut } = makeSut();

		const result = await sut.createUser({
			email: 'some_email_already_exists',
			user: 'some_user_name',
		});

		expect(result).toEqual({
			error: true,
			message: 'Usuário já existe',
		});
	});
});

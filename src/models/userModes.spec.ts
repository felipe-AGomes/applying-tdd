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
	deleteUser(id: { id: string }): Promise<{
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
			console.log(userData);
			return {
				error: true,
				message: 'Usuário já existe',
			};
		}

		const newUser = await User.create(user);

		await this.DatabaseConnection.disconnectDb();
		return {
			error: false,
			message: 'Usuário cadastrado com sucesso',
			user: newUser,
		};
	}

	async deleteUser({ id }: { id: string }): Promise<{
		error: boolean;
		message: string;
		user?: any;
	}> {
		await this.DatabaseConnection.connectDb();
		const userData = await User.findById(id);

		if (!userData) {
			return {
				error: true,
				message: 'Usuário não encontrado',
			};
		}

		await User.findByIdAndDelete(id);

		await this.DatabaseConnection.disconnectDb();
		return {
			error: false,
			message: 'Usuário deletado com sucesso',
			user: {
				user,
				email: newEmail,
			},
		};
	}
}

const makeSut = () => {
	const databaseConnectionLocalMongo = new DatabaseConnectionLocalMongo();
	const sut = new UserRepositoryMongo(databaseConnectionLocalMongo);
	return { sut, databaseConnectionLocalMongo };
};
const user = 'some_user_name';
const newEmail = 'some_user_email';
const existingEmail = 'some_existing_email';

describe('UserRepositoryMongo.createUser', () => {
	beforeAll(async () => {
		const { databaseConnectionLocalMongo } = makeSut();
		await databaseConnectionLocalMongo.connectDb();
		await User.create({
			email: existingEmail,
			user,
		});
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(async () => {
		const { databaseConnectionLocalMongo } = makeSut();
		await User.deleteMany({});
		await databaseConnectionLocalMongo.disconnectDb();
	});

	it('should return an user when is called with a correct parameters', async () => {
		const { sut } = makeSut();

		const result = await sut.createUser({
			email: newEmail,
			user,
		});

		expect(result).toHaveProperty('error', false);
		expect(result).toHaveProperty('message', 'Usuário cadastrado com sucesso');
		expect(result.user).toHaveProperty('email', newEmail);
		expect(result.user).toHaveProperty('user', user);
	});

	it('should return an error when a user already exists ', async () => {
		const { sut } = makeSut();

		const result = await sut.createUser({
			email: existingEmail,
			user,
		});

		expect(result).toEqual({
			error: true,
			message: 'Usuário já existe',
		});
	});
});

describe('UserRepositoryMongo.deleteUser', () => {
	beforeAll(async () => {
		const { databaseConnectionLocalMongo } = makeSut();
		await databaseConnectionLocalMongo.connectDb();
		await User.create({
			email: newEmail,
			user,
		});
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(async () => {
		const { databaseConnectionLocalMongo } = makeSut();
		await User.deleteMany({});
		await databaseConnectionLocalMongo.disconnectDb();
	});

	it('should return the user that will be deleted if called with the correct parameters', async () => {
		User.findById = jest.fn().mockResolvedValue({
			id: 'some_user_id',
			email: newEmail,
			user,
		});
		User.findByIdAndDelete = jest.fn().mockResolvedValue(undefined);
		const { sut } = makeSut();

		const result = await sut.deleteUser({ id: '645a7ac6274755f2baebe72a' });

		expect(result).toHaveProperty('error', false);
		expect(result).toHaveProperty('message', 'Usuário deletado com sucesso');
		expect(result.user).toHaveProperty('user', user);
		expect(result.user).toHaveProperty('email', newEmail);
	});

	it('should return an error if a user not exists', async () => {
		User.findById = jest.fn().mockResolvedValue(null);
		const { sut } = makeSut();

		const result = await sut.deleteUser({ id: '645a7ac6274755f2baebe72a2' });

		expect(result).toHaveProperty('error', true);
		expect(result).toHaveProperty('message', 'Usuário não encontrado');
	});
});

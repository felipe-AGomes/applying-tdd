import mongoose from 'mongoose';
import { DatabaseConnectionMongo } from './connectDb';

const url = 'mongodb://localhost:27017';

const makeSut = () => {
	const sut = new DatabaseConnectionMongo();
	return sut;
};

describe('DatabaseConnectionMongo', () => {
	afterAll(async () => {
		const sut = makeSut();
		await sut.disconnectDb();
		jest.clearAllMocks();
	});
	it('should display on console.log "Conectado ao banco de dados"', async () => {
		const consoleLogSpy = jest.spyOn(console, 'log');
		const sut = makeSut();

		await sut.connectDb(url);

		expect(consoleLogSpy).toBeCalledWith('Conectado ao banco de dados');
	});

	it('should trhow an error if wrong url is called', async () => {
		const sut = makeSut();
		const invalidUrl = 'some_wrong_url';
		jest
			.spyOn(mongoose, 'connect')
			.mockRejectedValueOnce(new Error('connection error'));

		await expect(sut.connectDb(invalidUrl)).rejects.toThrow(
			'Error: connection error'
		);
	});

	it('should call mongoose.disconnect', async () => {
		const sut = makeSut();
		const disconnectSpy = jest.spyOn(mongoose, 'disconnect');

		await sut.disconnectDb();

		expect(disconnectSpy).toBeCalledTimes(1);
	});
});

import mongoose from 'mongoose';
import { DatabaseConnectionLocalMongo } from './connectDb';

const makeSut = () => {
	const sut = new DatabaseConnectionLocalMongo();
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

		await sut.connectDb();

		expect(consoleLogSpy).toBeCalledWith('Conectado ao banco de dados');
	});
	it('should trhow an error if wrong url is called', async () => {
		const sut = makeSut();
		jest
			.spyOn(mongoose, 'connect')
			.mockRejectedValueOnce(new Error('connection error'));

		await expect(sut.connectDb()).rejects.toThrow('Error: connection error');
	});

	it('should call mongoose.disconnect', async () => {
		const sut = makeSut();
		const disconnectSpy = jest.spyOn(mongoose, 'disconnect');

		await sut.disconnectDb();

		expect(disconnectSpy).toBeCalledTimes(1);
	});
});

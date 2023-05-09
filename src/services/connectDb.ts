import mongoose from 'mongoose';

export interface DatabaseConnection {
	url: string;
	connectDb(): Promise<void>;
	disconnectDb(): Promise<void>;
}

export class DatabaseConnectionLocalMongo implements DatabaseConnection {
	url: string = 'mongodb://localhost:27017';
	async connectDb(): Promise<void> {
		try {
			await mongoose.connect(this.url);
			console.log('Conectado ao banco de dados');
		} catch (err) {
			throw new Error(`Error: ${err}`);
		}
	}

	async disconnectDb(): Promise<void> {
		await mongoose.disconnect();
	}
}

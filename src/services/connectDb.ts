import mongoose from 'mongoose';

export interface DatabaseConnection {
	connectDb(url: { url: string }): Promise<void>;
	disconnectDb(): Promise<void>;
}

export class DatabaseConnectionMongo implements DatabaseConnection {
	async connectDb({ url }: { url: string }): Promise<void> {
		try {
			await mongoose.connect(url);
			console.log('Conectado ao banco de dados');
		} catch (err) {
			throw new Error(`Error: ${err}`);
		}
	}

	async disconnectDb(): Promise<void> {
		await mongoose.disconnect();
	}
}

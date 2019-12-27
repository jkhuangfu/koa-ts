import * as mongoose from 'mongoose';

declare global {
  namespace FileModel {
    interface Schema {
      name: string;
      date: Date;
      version: string;
    }

    interface Model extends mongoose.Model<mongoose.Document, {}> {
      insert: () => Promise<any>;
      queryAll: () => Promise<any>;
      queryByTitle: (t: any) => Promise<any>;
    }
  }
}

import * as mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  }
});

fileSchema.statics = {
  async insert(info: FileModel.Schema) {
    return await this.insert(info);
  },
  async queryAll() {
    return await this.find();
  },
  async queryByTitle(con: FileModel.Schema) {
    return await this.find({
      name: con
    });
  }
};

const model = mongoose.model('file', fileSchema);
export default model as FileModel.Model;

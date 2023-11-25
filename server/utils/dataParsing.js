import { existsSync, createReadStream } from 'fs';
import path from 'path';
import { Extract } from 'unzipper';
import csvtojson from 'csvtojson';
import DBConnection from './dbConfig.js';
import getPathName from './extractPath.js';

class CreateCollections {
  async init() {
    this.database = DBConnection();

    await this.createSellersCollection();
    await this.createProductsCollection();
    await this.createOrdersCollection();
  }

  async create(collectionName, data) {
    const collectionExists = await this.database.listCollections({name: collectionName}).hasNext();
    if (!collectionExists) {
        console.log(`Creating ${collectionName} collection...`);
  
        const collection = this.database.collection(collectionName);
        await collection.insertMany(data);
        
        console.log(`${collectionName} collection successfully created`);
    }
    else {
      console.log(`${collectionName} collection already exists! Skipping step...`);
    }
  }
    
  async createSellersCollection() {
    const csvPath = path.join(getPathName(), '../datasets/olist_sellers_dataset.csv');
    const data = await csvtojson().fromFile(csvPath);

    this.create('sellers', data);
  }
  
  async createProductsCollection() {
    const csvPath = await this.extractDataPath('olist_products_dataset');
    const data = await csvtojson().fromFile(csvPath);

    this.create('products', data);
  }
  
  async createOrdersCollection() {
    const csvPath = await this.extractDataPath('olist_order_items_dataset');
    const data = await csvtojson().fromFile(csvPath);

    this.create('orders', data);
  }

  async extractDataPath(filePath) {
    const newFilePath = path.join(getPathName(), '../datasets');
    const csvPath = path.join(newFilePath, `${filePath}.csv`);

    if (!existsSync(csvPath)) {
      const zipFilePath = path.join(getPathName(), `../datasets/${filePath}.csv.zip`);
      
      await createReadStream(zipFilePath).pipe(Extract({ path: newFilePath })).promise();
    }

    return csvPath;
  }
}

export default CreateCollections;

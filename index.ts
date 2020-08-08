import mongoose from 'mongoose'
import chalk from 'chalk'
import glob from 'glob'
import path from 'path'

export interface ConnectionOptions {
  uri: string
  user: string
  pass: string
}

class Mongoose {
  public loadModels = () => {
    const modelPaths = glob.sync(process.env.MONGODB_MODELS)
    console.log('---------------------------------------------------------')
    modelPaths.forEach(modelPath => {
      console.log(chalk.green(`+ ADDED - Model: ${modelPath}`))
      import (path.join(process.cwd(), modelPath))
    })
  }

  public connectionOptions = (connect: string): ConnectionOptions => ({
    uri: process.env[`MONGODB_${connect}_URI`] || '',
    user: process.env[`MONGODB_${connect}_USER`] || '',
    pass: process.env[`MONGODB_${connect}_PASS`] || '',
  })

  public createConnection = ({ uri, user, pass }: ConnectionOptions) => {
    const options = {
      user,
      pass,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
    return mongoose.createConnection(uri, options)
  }
  
  public connect = async ({ uri, user, pass }: ConnectionOptions) => {
    try {
      const options = {
        user,
        pass,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
      console.log('---------------------------------------------------------')
      console.log(chalk.green(`MongoDb connection:  ${uri}`))
      return await mongoose.connect(uri, options)
    }
    catch(err) {
      console.log('---------------------------------------------------------')
      console.error(chalk.red('Could not connect to MongoDB!'))
      console.log(err)
    }
  }
}

export default new Mongoose()
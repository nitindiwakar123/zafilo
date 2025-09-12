import { connectDB, client } from "./db.js";

const db = await connectDB();

const collections = await db.listCollections().toArray();
const existing = collections.map((collection) => collection.name);

const collectionValidators = [
    {
        collection: "directories",
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: [
                    '_id',
                    'name',
                    'parentDirId',
                    'userId'
                ],
                properties: {
                    _id: {
                        bsonType: 'objectId',
                        description: 'Unique directory identifier (ObjectId)'
                    },
                    name: {
                        bsonType: 'string',
                        minLength: 1,
                        maxLength: 100,
                        description: 'Directory name, 1–100 characters'
                    },
                    parentDirId: {
                        bsonType: [
                            'objectId',
                            'null'
                        ],
                        description: 'Parent directory reference (ObjectId) or null for root'
                    },
                    userId: {
                        bsonType: 'objectId',
                        description: 'Owner user identifier (ObjectId)'
                    }
                },
                additionalProperties: false
            }
        }
    },
    {
        collection: "files",
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: [
                    '_id',
                    'name',
                    'extension',
                    'parentDirId',
                    'userId'
                ],
                properties: {
                    _id: {
                        bsonType: 'objectId',
                        description: 'Unique file identifier (ObjectId)'
                    },
                    name: {
                        bsonType: 'string',
                        minLength: 1,
                        maxLength: 100,
                        description: 'File name, 1–100 characters'
                    },
                    extension: {
                        bsonType: 'string',
                        minLength: 2,
                        maxLength: 10,
                        pattern: '^\\.[a-zA-Z0-9]+$',
                        description: 'File extension with leading dot (e.g., .txt, .jpg, .pdf)'
                    },
                    parentDirId: {
                        bsonType: 'objectId',
                        description: 'Parent directory reference (ObjectId)'
                    },
                    userId: {
                        bsonType: 'objectId',
                        description: 'Owner user identifier (ObjectId)'
                    }
                },
                additionalProperties: false
            }
        }
    },
    {
        collection: "users",
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: [
                    '_id',
                    'name',
                    'email',
                    'password',
                    'rootDirId'
                ],
                properties: {
                    _id: {
                        bsonType: 'objectId',
                        description: 'Unique identifier (ObjectId)'
                    },
                    name: {
                        bsonType: 'string',
                        minLength: 3,
                        maxLength: 30,
                        description: 'String, 3–30 characters'
                    },
                    email: {
                        bsonType: 'string',
                        minLength: 6,
                        maxLength: 254,
                        pattern: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$',
                        description: 'Valid email address'
                    },
                    password: {
                        bsonType: 'string',
                        minLength: 8,
                        maxLength: 20,
                        description: 'String, 8–20 characters'
                    },
                    rootDirId: {
                        bsonType: 'objectId',
                        description: 'Root directory reference (ObjectId)'
                    },
                    profilePic: {
                        bsonType: 'string',
                        description: 'profile picture name'
                    }
                },
                additionalProperties: false
            }
        }
    }
]

for await (const collectionValidator of collectionValidators) {
    try {
        if (!existing.includes(collectionValidator.collection)) {
            await db.createCollection(collectionValidator.collection);
        }

        await db.command({
            collMod: collectionValidator.collection,
            validator: collectionValidator.validator,
            validationLevel: "strict",
            validationAction: "error"
        });
    } catch (error) {
        console.log(`Error while updating ${collectionValidator.collection}: `, error.message);
    }
}

client.close();
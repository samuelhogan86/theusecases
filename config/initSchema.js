async function initSchema(db) {
    const collections = await db.listCollections().toArray();
    const names = collections.map(col => col.name);

    if(!names.includes('users')) {
        await db.createCollection('users', {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["firstName", "lastName", "username", "passwordHash", "role"],
                    properties: {
                        id: { bsonType: "string" },
                        firstName: { bsonType: "string" },
                        lastName: { bsonType: "string" },
                        username: { bsonType: "string" },
                        passwordHash: { bsonType: "string" },
                        role: { bsonType: "string", enum: ["admin", "doctor", "patient"] },
                        lastLogin: { bsonType: "date" },
                        lastPasswordChange: { bsonType: "date" }
                    }
                }
            }
        });
        console.log("Created 'users' collection with schema validation");
    } else {
        console.log("'users' collection already exists, updating validation...");
        await db.command({
            collMod: 'users',
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["firstName", "lastName", "username", "passwordHash", "role"],
                    properties: {
                        id: { bsonType: "string" },
                        firstName: { bsonType: "string" },
                        lastName: { bsonType: "string" },
                        username: { bsonType: "string" },
                        passwordHash: { bsonType: "string" },
                        role: { bsonType: "string", enum: ["admin", "doctor", "patient"] },
                        lastLogin: { bsonType: "date" },
                        lastPasswordChange: { bsonType: "date" }
                    }
                }
            },
            validationLevel: 'strict',
            validationAction: 'error'
        });
        console.log("Updated 'users' collection validation");
    }

    try {
        await db.collections('user').createIndex({ username: 1 }, { unique: true });
        await db.collections('user').createIndex({ id: 1 }, { unique: true });
        console.log('Created unique indexes for username and id');
    }
    catch (error) {
        console.log('Indexes may already exist:', error.message);
    }

    if(!names.includes("appointments")) {
        await db.createCollection("appointments", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["date", "startTime", "endTime", "patientId", "doctorId"],
                    properties: {
                        date: { bsonType: "date" },
                        startTime: { bsonType: "string" },
                        endTime: { bsonType: "string" },
                        patientId: { bsonType: "objectId" },
                        doctorId: { bsonType: "objectId" },
                        lastUpdated: { bsonType: "date" }
                    }
                }
            }
        });
        console.log("Created 'appointments' collection with schema validation");
    } else {
        console.log("'appointments' collection already exists, updating validation...");
        await db.command({
            collMod: 'appointments',
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["date", "startTime", "endTime", "patientId", "doctorId"],
                    properties: {
                        date: { bsonType: "date" },
                        startTime: { bsonType: "string" },
                        endTime: { bsonType: "string" },
                        patientId: { bsonType: "objectId" },
                        doctorId: { bsonType: "objectId" },
                        lastUpdated: { bsonType: "date" }
                    }
                }
            },
            validationLevel: 'strict',
            validationAction: 'error'
        });
        console.log("Updated 'appointments' collection validation");
    }
}

module.exports = { initSchema };
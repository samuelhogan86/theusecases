async function initSchema(db) {
    const collections = await db.listCollections().toArray();
    const names = collections.map(col => col.name);

    if(!names.includes('users')) {
        await db.createCollection('users', {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["id", "firstName", "lastName", "username", "passwordHash", "role"],
                    properties: {
                        id: { bsonType: "int" },
                        firstName: { bsonType: "string" },
                        lastName: { bsonType: "string" },
                        username: { bsonType: "string" },
                        passwordHash: { bsonType: "string" },
                        role: { bsonType: "string" },
                        lastLogin: { bsonType: "timestamp" },
                        lastPasswordChange: { bsonType: "timestamp" }
                    }
                }
            }
        });
        console.log("Created 'users' collection with schema validation");
    }

    if(!names.includes("appointments")) {
        await db.createCollection("appointments", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["id",  "date", "startTime", "endTime", "patientId", "doctorId"],
                    properties: {
                        id: { bsonType: "int" },
                        date: { bsonType: "date" },
                        startTime: { bsonType: "string" },
                        endTime: { bsonType: "string" },
                        patientId: { bsonType: "int" },
                        doctorId: { bsonType: "int" },
                        lastUpdated: { bsonType: "timestamp" }
                    }
                }
            }
        });
        console.log("Created 'appointments' collection with schema validation");
    }
}

module.exports = { initSchema };